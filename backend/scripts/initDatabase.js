const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create ENUM types
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('restaurant_owner', 'investor');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE campaign_status AS ENUM ('active', 'funded', 'closed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE investment_status AS ENUM ('pending', 'completed', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role user_role NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Restaurants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        cuisine_type VARCHAR(100),
        location VARCHAR(255),
        address TEXT,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Campaigns table
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        funding_goal DECIMAL(12, 2) NOT NULL,
        current_funding DECIMAL(12, 2) DEFAULT 0,
        interest_rate DECIMAL(5, 2),
        duration_months INTEGER,
        status campaign_status DEFAULT 'active',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Investments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        investor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(12, 2) NOT NULL,
        investment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status investment_status DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON restaurants(owner_id);
      CREATE INDEX IF NOT EXISTS idx_campaigns_restaurant ON campaigns(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
      CREATE INDEX IF NOT EXISTS idx_investments_campaign ON investments(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_investments_investor ON investments(investor_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
