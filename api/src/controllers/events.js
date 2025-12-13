const getEvents = async (req, res) => {
  try {
    const { sport_type, sport, skill_level, date_from, date_to, location } = req.query;
    const supabase = req.supabase ?? req.app.get('supabase');
    
    let query = supabase
      .from('events')
      .select('*');
    
    const resolvedSport = sport ?? sport_type;
    if (resolvedSport) query = query.eq('sport_type', resolvedSport);
    if (skill_level) query = query.eq('skill_level', skill_level);
    if (location) query = query.ilike('location', `%${location}%`);

    if (date_from && date_to) {
      query = query.gte('start_time', date_from).lte('start_time', date_to);
    } else if (date_from) {
      query = query.gte('start_time', date_from);
    } else if (date_to) {
      query = query.lte('start_time', date_to);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;

    const normalized = (data ?? []).map((row) => {
      if (!row || typeof row !== 'object') return row;
      const details = row.details ?? row.description ?? null;
      const normalizedSport = row.sport ?? row.sport_type ?? null;
      return { ...row, details, sport: normalizedSport };
    });

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const now = new Date().toISOString();

    const { description, details, sport, sport_type, ...rest } = req.body ?? {};
    const mergedDetails = details ?? description;
    const mergedSport = sport ?? sport_type;

    if (mergedSport === undefined || mergedSport === null || String(mergedSport).trim().length === 0) {
      return res.status(400).json({ message: 'Sport is required.' });
    }

    const startTimeForDate = rest.start_time ?? rest.event_date ?? null;
    const derivedEventDate = (() => {
      if (typeof rest.event_date === 'string' && rest.event_date.trim().length > 0) return rest.event_date;
      if (typeof startTimeForDate === 'string' && startTimeForDate.trim().length > 0) {
        const d = new Date(startTimeForDate);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      }
      return new Date().toISOString().slice(0, 10);
    })();

    const derivedEventDuration = (() => {
      if (rest.event_duration !== undefined && rest.event_duration !== null && String(rest.event_duration).trim().length > 0) {
        return rest.event_duration;
      }
      const start = typeof rest.start_time === 'string' ? new Date(rest.start_time) : null;
      const end = typeof rest.end_time === 'string' ? new Date(rest.end_time) : null;
      if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        const minutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
        return minutes;
      }
      return 60;
    })();

    const payloadWithDetails = {
      ...rest,
      ...(mergedDetails !== undefined ? { details: mergedDetails } : {}),
      ...(mergedSport !== undefined ? { sport: mergedSport, sport_type: mergedSport } : {}),
      ...(rest.event_date === undefined ? { event_date: derivedEventDate } : {}),
      ...(rest.event_duration === undefined ? { event_duration: derivedEventDuration } : {}),
      ...(rest.user_id === undefined ? { user_id: userId } : {}),
    };

    const payloadWithDescription = {
      ...rest,
      ...(mergedDetails !== undefined ? { description: mergedDetails } : {}),
      ...(mergedSport !== undefined ? { sport: mergedSport, sport_type: mergedSport } : {}),
      ...(rest.event_date === undefined ? { event_date: derivedEventDate } : {}),
      ...(rest.event_duration === undefined ? { event_duration: derivedEventDuration } : {}),
      ...(rest.user_id === undefined ? { user_id: userId } : {}),
    };

    const eventData = {
      ...payloadWithDetails,
      host_id: userId,
      created_at: now,
      updated_at: now,
    };
    
    const supabase = req.supabase ?? req.app.get('supabase');

    let data;
    let error;
    ({ data, error } = await supabase.from('events').insert([eventData]).select().single());

    if (
      error &&
      typeof error.message === 'string' &&
      error.message.includes("Could not find the 'details' column")
    ) {
      const fallback = {
        ...payloadWithDescription,
        host_id: userId,
        created_at: now,
        updated_at: now,
      };
      ({ data, error } = await supabase.from('events').insert([fallback]).select().single());
    }

    if (
      error &&
      typeof error.message === 'string' &&
      error.message.includes("Could not find the 'description' column")
    ) {
      const fallback = {
        ...payloadWithDetails,
        host_id: userId,
        created_at: now,
        updated_at: now,
      };
      ({ data, error } = await supabase.from('events').insert([fallback]).select().single());
    }
      
    if (error) throw error;

    const normalized =
      data && typeof data === 'object'
        ? {
            ...data,
            details: data.details ?? data.description ?? null,
            sport: data.sport ?? data.sport_type ?? null,
          }
        : data;
    res.status(201).json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const supabase = req.supabase ?? req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Event not found' });

    const normalized =
      data && typeof data === 'object'
        ? {
            ...data,
            details: data.details ?? data.description ?? null,
            sport: data.sport ?? data.sport_type ?? null,
          }
        : data;
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const supabase = req.supabase ?? req.app.get('supabase');
    
    // First verify the user owns this event
    const { data: event } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', eventId)
      .single();
      
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.host_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    const { description, details, sport, sport_type, ...rest } = req.body ?? {};
    const mergedDetails = details ?? description;
    const mergedSport = sport ?? sport_type;

    const startTimeForDate = rest.start_time ?? rest.event_date ?? null;
    const derivedEventDate = (() => {
      if (typeof rest.event_date === 'string' && rest.event_date.trim().length > 0) return rest.event_date;
      if (typeof startTimeForDate === 'string' && startTimeForDate.trim().length > 0) {
        const d = new Date(startTimeForDate);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      }
      return undefined;
    })();

    const derivedEventDuration = (() => {
      if (rest.event_duration !== undefined && rest.event_duration !== null && String(rest.event_duration).trim().length > 0) {
        return rest.event_duration;
      }
      const start = typeof rest.start_time === 'string' ? new Date(rest.start_time) : null;
      const end = typeof rest.end_time === 'string' ? new Date(rest.end_time) : null;
      if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        const minutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
        return minutes;
      }
      return undefined;
    })();

    const payloadWithDetails = {
      ...rest,
      ...(mergedDetails !== undefined ? { details: mergedDetails } : {}),
      ...(mergedSport !== undefined ? { sport: mergedSport, sport_type: mergedSport } : {}),
      ...(rest.event_date === undefined && derivedEventDate !== undefined ? { event_date: derivedEventDate } : {}),
      ...(rest.event_duration === undefined && derivedEventDuration !== undefined
        ? { event_duration: derivedEventDuration }
        : {}),
      ...(rest.user_id === undefined ? { user_id: userId } : {}),
      updated_at: new Date().toISOString(),
    };

    const payloadWithDescription = {
      ...rest,
      ...(mergedDetails !== undefined ? { description: mergedDetails } : {}),
      ...(mergedSport !== undefined ? { sport: mergedSport, sport_type: mergedSport } : {}),
      ...(rest.event_date === undefined && derivedEventDate !== undefined ? { event_date: derivedEventDate } : {}),
      ...(rest.event_duration === undefined && derivedEventDuration !== undefined
        ? { event_duration: derivedEventDuration }
        : {}),
      ...(rest.user_id === undefined ? { user_id: userId } : {}),
      updated_at: new Date().toISOString(),
    };

    let data;
    let error;
    ({ data, error } = await supabase.from('events').update(payloadWithDetails).eq('id', eventId).select().single());

    if (
      error &&
      typeof error.message === 'string' &&
      error.message.includes("Could not find the 'details' column")
    ) {
      ({ data, error } = await supabase.from('events').update(payloadWithDescription).eq('id', eventId).select().single());
    }

    if (
      error &&
      typeof error.message === 'string' &&
      error.message.includes("Could not find the 'description' column")
    ) {
      ({ data, error } = await supabase.from('events').update(payloadWithDetails).eq('id', eventId).select().single());
    }
      
    if (error) throw error;

    const normalized =
      data && typeof data === 'object'
        ? {
            ...data,
            details: data.details ?? data.description ?? null,
            sport: data.sport ?? data.sport_type ?? null,
          }
        : data;
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const supabase = req.supabase ?? req.app.get('supabase');
    
    // First verify the user owns this event
    const { data: event } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', eventId)
      .single();
      
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.host_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    // Delete related RSVPs first
    await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId);
    
    // Delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
      
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
};
