const TABLE = 'qa_test_records';

const listTestRecords = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const supabase = req.app.get('supabase');
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTestRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, payload } = req.body ?? {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'title is required' });
    }

    const now = new Date().toISOString();
    const supabase = req.app.get('supabase');

    const { data, error } = await supabase
      .from(TABLE)
      .insert([
        {
          user_id: userId,
          title,
          payload: payload ?? null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTestRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const { title, payload } = req.body ?? {};

    const supabase = req.app.get('supabase');
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        ...(title !== undefined ? { title } : {}),
        ...(payload !== undefined ? { payload } : {}),
        updated_at: now,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Record not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTestRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const supabase = req.app.get('supabase');

    const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listTestRecords,
  createTestRecord,
  updateTestRecord,
  deleteTestRecord,
};
