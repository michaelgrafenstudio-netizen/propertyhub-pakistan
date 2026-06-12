import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Mock Admin & Agent Users
  const passwordHash = await bcrypt.hash('PropertyHub123!', 10);

  const admin = await prisma.user.upsert({
    where: { phone: '+923001234567' },
    update: {},
    create: {
      phone: '+923001234567',
      email: 'admin@propertyhub.com.pk',
      passwordHash,
      role: 'ADMIN',
      profile: {
        create: {
          fullName: 'PropertyHub Admin Team',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
          bio: 'Platform administration and property validation supervisor.',
          isVerified: true,
        },
      },
    },
  });

  const agent = await prisma.user.upsert({
    where: { phone: '+923129876543' },
    update: {},
    create: {
      phone: '+923129876543',
      email: 'ali.khan@realestate.com.pk',
      passwordHash,
      role: 'AGENT',
      profile: {
        create: {
          fullName: 'Ali Khan',
          avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
          bio: 'Top real estate consultant specializing in DHA and Bahria Town.',
          agencyName: 'Legacy Estates Lahore',
          agencyLicense: 'LHR-RE-9921',
          whatsappNumber: '+923129876543',
          isVerified: true,
        },
      },
    },
  });

  const seller = await prisma.user.upsert({
    where: { phone: '+923214567890' },
    update: {},
    create: {
      phone: '+923214567890',
      email: 'seller.ahmad@outlook.com',
      passwordHash,
      role: 'SELLER',
      profile: {
        create: {
          fullName: 'Muhammad Ahmad',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          bio: 'Private property seller.',
          whatsappNumber: '+923214567890',
          isVerified: false,
        },
      },
    },
  });

  // 2. Create Sample Properties
  const prop1 = await prisma.property.create({
    data: {
      ownerId: agent.id,
      title: '5 Marla Modern Luxury House in DHA Phase 6',
      description: 'Stunning double-story 5 Marla designer house built with state of the art luxury specifications. Features include imported bathroom tiles, ash woodwork, and modern high-ceiling kitchen.',
      price: 18500000.00, // 1.85 Crore
      type: 'HOUSE',
      purpose: 'SALE',
      status: 'ACTIVE',
      city: 'Lahore',
      area: 'DHA Phase 6',
      address: 'Sector K, Street 12, DHA Phase 6, Lahore',
      latitude: 31.4705,
      longitude: 74.4533,
      areaSize: 5.0,
      areaUnit: 'MARLA',
      bedrooms: 3,
      bathrooms: 4,
      parking: 1,
      amenities: ['Gas', 'Electricity', 'Water', 'Gated Community', 'Security Guard'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' }
        ]
      }
    }
  });

  const prop2 = await prisma.property.create({
    data: {
      ownerId: agent.id,
      title: '2 Bed Luxury Apartment in Centaurus Heights',
      description: 'Fully furnished high-rise apartment in the heart of Islamabad. Features scenic views of Margalla Hills, centralized cooling, and membership to the Centaurus gym & pool.',
      price: 125000.00, // 1.25 Lakh per month
      type: 'APARTMENT',
      purpose: 'RENT',
      status: 'ACTIVE',
      city: 'Islamabad',
      area: 'F-8',
      address: 'Tower A, Centaurus Heights, F-8, Islamabad',
      latitude: 33.7081,
      longitude: 73.0504,
      areaSize: 8.5,
      areaUnit: 'MARLA',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      amenities: ['Central Air Conditioning', 'Electricity', 'Water', 'Gym', 'Swimming Pool'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600' }
        ]
      }
    }
  });

  const prop3 = await prisma.property.create({
    data: {
      ownerId: seller.id,
      title: '1 Kanal Residential Plot in Bahria Town',
      description: 'Outstanding direct-level residential plot for sale in Block C, Bahria Town. All dues clear, street paved, ready for immediate possession.',
      price: 32000000.00, // 3.2 Crore
      type: 'PLOT',
      purpose: 'SALE',
      status: 'PENDING_VERIFICATION',
      city: 'Karachi',
      area: 'Bahria Town',
      address: 'Street 4, Sector C, Bahria Town Karachi',
      latitude: 25.0112,
      longitude: 67.3114,
      areaSize: 1.0,
      areaUnit: 'KANAL',
      amenities: ['Electricity', 'Sewerage', 'Paved Road'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600' }
        ]
      }
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
