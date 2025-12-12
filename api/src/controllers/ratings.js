const getEventRatings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const supabase = req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('ratings')
      .select('*, rater:profiles!ratings_from_user_id_fkey(*)')
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitRating = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { rating, comment = null } = req.body ?? {};
    const supabase = req.app.get('supabase');

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be a number between 1 and 5' });
    }
    
    // Check if event exists and user attended
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', eventId)
      .single();
      
    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if user has RSVP'd to the event
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (rsvpError) throw rsvpError;
    if (!rsvp) {
      return res.status(400).json({ message: 'You must attend an event before rating it' });
    }
    
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('ratings')
      .upsert(
        {
          from_user_id: userId,
          to_user_id: event.host_id,
          event_id: eventId,
          rating,
          comment,
          created_at: now,
        },
        { onConflict: 'from_user_id,event_id' }
      )
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHostRatings = async (req, res) => {
  try {
    const { hostId } = req.params;
    const supabase = req.app.get('supabase');
    
    // Get all ratings for this host with event and rater info
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select(`
        *,
        event:events(*),
        rater:profiles!ratings_from_user_id_fkey(*)
      `)
      .eq('to_user_id', hostId);
      
    if (ratingsError) throw ratingsError;

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEventRatings,
  submitRating,
  getHostRatings
};
