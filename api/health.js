module.exports = (_req, res) => {
  res.json({
    ok: true,
    service: 'eduai-cms',
    supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    adminToken: !!process.env.CMS_ADMIN_TOKEN,
  });
};
