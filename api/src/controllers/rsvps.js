const getEventRsvps = async (req, res) => {
  try {
    const { eventId } = req.params;
    const supabase = req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('rsvps')
      .select('*, user:profiles(*)')
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmRsvp = async (req, res) => {
  try {
    const { eventId, rsvpId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const supabase = req.app.get('supabase');

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (String(event.host_id) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to manage RSVPs for this event' });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('rsvps')
      .update({
        host_confirmed: true,
        confirmed_at: now,
        updated_at: now,
      })
      .eq('id', rsvpId)
      .eq('event_id', eventId)
      .select('*, user:profiles(*), event:events(*)')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'RSVP not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserRsvps = async (req, res) => {
  try {
    const { userId } = req.params;
    const supabase = req.app.get('supabase');

    const { data, error } = await supabase
      .from('rsvps')
      .select('*, event:events(*)')
      .eq('user_id', userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRsvp = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { status = 'going' } = req.body ?? {};
    const supabase = req.app.get('supabase');
    
    // Check if event exists and has capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('max_participants')
      .eq('id', eventId)
      .single();
      
    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Capacity check counts RSVPs that would occupy a slot (going/maybe)
    if (event.max_participants) {
      const { count, error: countError } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .in('status', ['going', 'maybe']);

      if (countError) throw countError;

      if ((count ?? 0) >= event.max_participants && status !== 'not_going') {
        return res.status(400).json({ message: 'Event is at capacity' });
      }
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('rsvps')
      .upsert(
        {
          event_id: eventId,
          user_id: userId,
          status,
          host_confirmed: false,
          confirmed_at: null,
          updated_at: now,
        },
        { onConflict: 'event_id,user_id' }
      )
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelMyRsvp = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const supabase = req.app.get('supabase');
    
    // Delete the RSVP
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEventRsvps,
  getUserRsvps,
  createRsvp,
  confirmRsvp,
  cancelMyRsvp
};
