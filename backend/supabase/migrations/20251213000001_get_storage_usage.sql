-- Create RPC function to get storage usage
create or replace function public.get_storage_usage()
returns json
language plpgsql
security definer
as $$
declare
  total_bytes bigint;
  bucket_stats json;
begin
  -- Calculate total size across all buckets
  select sum((metadata->>'size')::bigint)
  into total_bytes
  from storage.objects;

  -- Calculate per-bucket size
  -- We group by bucket_id and sum the size
  select json_agg(stats)
  into bucket_stats
  from (
    select
      bucket_id as name,
      sum((metadata->>'size')::bigint) as size_bytes
    from storage.objects
    group by bucket_id
    order by size_bytes desc
  ) stats;

  return json_build_object(
    'total_bytes', coalesce(total_bytes, 0),
    'limit_bytes', 107374182400, -- 100 GB in bytes
    'buckets', coalesce(bucket_stats, '[]'::json)
  );
end;
$$;

-- Grant access to authenticated users (admin dashboard users)
grant execute on function public.get_storage_usage() to authenticated;
grant execute on function public.get_storage_usage() to service_role;
