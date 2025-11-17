const getEventRatings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const supabase = req.app.get('supabase');
    
    const { data, error } = await supabase
      .from('ratings')
      .select('*, user:profiles(*)')
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
    
    const { star_rating } = req.body;
    const supabase = req.app.get('supabase');
    
    // Check if event exists and user attended
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('user_id')
      .eq('event_id', eventId)
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
    
    // Check if user already rated this event
    const { data: existingRating, error: existingError } = await supabase
      .from('ratings')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
      
    let data;
    if (existingRating) {
      // Update existing rating
      const { data: updatedRating, error: updateError } = await supabase
        .from('ratings')
        .update({
          star_rating,
          updated_at: new Date().toISOString()
        })
        .eq('rating_id', existingRating.rating_id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      data = updatedRating;
    } else {
      // Create new rating
      const { data: newRating, error: createError } = await supabase
        .from('ratings')
        .insert([{
          event_id: eventId,
          user_id: userId,
          host_id: event.user_id,
          star_rating,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (createError) throw createError;
      data = newRating;
    }
    
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
        rater:profiles!ratings_user_id_fkey(*)
      `)
      .eq('host_id', hostId);
      
    if (ratingsError) throw ratingsError;
    
    // Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.star_rating, 0) / ratings.length
      : 0;
    
    res.json({
      host_id: hostId,
      total_ratings: ratings.length,
      average_rating: parseFloat(averageRating.toFixed(2)),
      ratings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEventRatings,
  submitRating,
  getHostRatings
};
