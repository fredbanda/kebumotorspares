# Specials Feature - Deployment Checklist

## Pre-Deployment Checklist

### 1. **Database Backup** ✓
```bash
# Backup your current database before running migrations
# PostgreSQL:
pg_dump <your-database-name> > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. **Run Database Migration**
```bash
cd D:\business-apps\kebumotorspares
pnpm prisma migrate dev --name add_specials
```

Expected output:
```
✔ Prisma Migrate created the following migration(s):

  createspecials.sql

✔ Database migrated to 'dev' environment.
```

### 3. **Generate Prisma Client**
```bash
pnpm prisma generate
```

### 4. **Verify Database Tables**
```bash
# Connect to your PostgreSQL database
psql <your-database-connection-string>

# Run these queries
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('specials', 'special_related_products');

# Should return:
#     table_name
# ──────────────────────────────
#  specials
#  special_related_products
```

## Deployment Steps

### Development Environment

#### Step 1: Pull Latest Code
```bash
cd D:\business-apps\kebumotorspares
git pull origin main
```

#### Step 2: Install Dependencies (if needed)
```bash
pnpm install
```

#### Step 3: Run Migrations
```bash
pnpm prisma migrate dev
```

#### Step 4: Start Dev Server
```bash
pnpm dev
```

#### Step 5: Verify Installation
1. Navigate to `http://localhost:3000/store-admin`
2. Look for **"Specials"** tab in the sidebar (with sparkle icon)
3. Click "Create Special" - form should load
4. Try creating a test special

### Production Environment

#### Step 1: Create Migration
```bash
# On development machine
pnpm prisma migrate dev --name add_specials_production
```

#### Step 2: Push to Repository
```bash
git add prisma/migrations/
git commit -m "migrations: Add specials tables"
git push origin main
```

#### Step 3: On Production Server
```bash
# Pull latest code
git pull origin main

# Install dependencies (if needed)
pnpm install

# Apply migrations
pnpm prisma migrate deploy

# Verify
pnpm prisma studio  # Optional: visual database browser
```

#### Step 4: Restart Application
```bash
# If using PM2
pm2 restart <app-name>

# If using Docker
docker-compose restart app

# If using direct Node
# Stop current process and restart
npm run start
```

#### Step 5: Health Check
- Visit `/store-admin` and verify Specials tab appears
- Create a test special
- View on storefront and verify badge displays

## Post-Deployment Verification

### Admin Side
```
✓ Specials tab appears in sidebar
✓ Can create a new special
✓ Can edit existing specials
✓ Can add related products
✓ Can delete specials
✓ Date pickers work correctly
✓ Discount % auto-calculates
```

### Storefront Side
```
✓ Product cards show red badge for active specials
✓ Badge displays: original price (struck), "No", sale price, discount %
✓ Product detail page shows special pricing
✓ "You save" message displays in green
✓ Related products section appears
✓ Related products are clickable
✓ Regular products without specials display normally
```

## Rollback Procedure

If something goes wrong:

### Option 1: Rollback Database
```bash
# List available migrations
pnpm prisma migrate status

# Revert to previous migration
pnpm prisma migrate resolve --rolled-back add_specials

# Reset to specific point
pnpm prisma migrate reset
```

### Option 2: Git Rollback
```bash
# Revert code to previous commit
git revert HEAD
git push origin main

# Then restart app
```

### Option 3: Full Database Restore
```bash
# PostgreSQL
psql <database> < backup_file.sql

# Restart app
pm2 restart <app-name>
```

## Troubleshooting

### Issue: Migration fails
```
Error: Database "..." is locked
```
**Solution:** Kill other connections to database
```bash
# PostgreSQL
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'your_database' 
AND pid <> pg_backend_pid();
```

### Issue: Prisma Client not generated
```
Error: Cannot find module '@prisma/client'
```
**Solution:**
```bash
pnpm prisma generate
pnpm install
```

### Issue: Special badge not showing on storefront
```
Verify:
1. Product has an active special
2. Special startDate is before today
3. Special endDate is after today (or null)
4. Database tables exist
5. API endpoint returns specials correctly
```

Check API:
```bash
curl http://localhost:3000/api/admin/specials
# Should return array of specials
```

### Issue: Admin form not saving
```
Check browser console for errors:
F12 → Console tab
Look for fetch errors or validation issues
```

## Performance Considerations

### Database Indexes
The migration automatically creates necessary indexes on:
- `Special.productId` (foreign key)
- `SpecialRelatedProduct.specialId` (foreign key)
- `SpecialRelatedProduct.productId` (foreign key)

### Caching
Consider adding to-be-deployed app cache for:
- `/api/admin/specials` (5-10 second cache)
- Product cards with specials (product-level cache invalidation)

### Query Optimization
The API includes these optimized queries:
```typescript
// Uses single query with included relations
db.special.findMany({
  include: {
    product: { select: { id, name, price, imageUrl } },
    relatedProducts: { include: { product: { select: { ... } } } }
  }
})
```

## Monitoring

### Check Logs
```bash
# View application logs
pm2 logs <app-name>

# Or for Docker
docker-compose logs app
```

### Database Monitoring
```bash
# Check table sizes
SELECT 
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_stat_user_tables
WHERE relname IN ('specials', 'special_related_products');
```

### API Health
```bash
# Test API endpoint
curl -X GET http://localhost:3000/api/admin/specials
curl -X GET http://localhost:3000/api/admin/specials/[product-id]
```

## Maintenance

### Regular Tasks

**Weekly:**
- Check for expired specials and mark inactive
- Monitor database performance

**Monthly:**
- Review special conversion rates
- Archive old specials
- Backup database

**Quarterly:**
- Clean up orphaned records
- Optimize indexes if needed

### Data Cleanup
```sql
-- Find specials past their end date
SELECT * FROM specials WHERE "endsAt" < NOW() AND active = true;

-- Mark them inactive
UPDATE specials SET active = false 
WHERE "endsAt" < NOW() AND active = true;

-- Delete orphaned related products (if a special is deleted)
DELETE FROM special_related_products 
WHERE "specialId" NOT IN (SELECT id FROM specials);
```

## Support & Documentation

- **Quick Start:** See `SPECIALS_QUICK_START.md`
- **Implementation Details:** See `SPECIALS_IMPLEMENTATION.md`
- **API Reference:** See API Endpoints section in implementation docs
- **Component Docs:** Check JSDoc comments in component files

## Success Criteria

After deployment, verify:

- [ ] Specials tab appears in admin
- [ ] Can create/edit/delete specials
- [ ] Can add/remove related products
- [ ] Special badge shows on product cards
- [ ] Sale price displays on product detail
- [ ] Related products section appears on detail page
- [ ] No JavaScript errors in browser console
- [ ] No database errors in logs
- [ ] Database tables created and populated correctly
- [ ] All CRUD operations work smoothly

---

**Last Updated:** 2026-10-27  
**Version:** 1.0  
**Status:** Ready for Deployment
