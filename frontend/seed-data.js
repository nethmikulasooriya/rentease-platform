const axios = require('axios');

const USER_API = 'http://localhost:8081/api/v1';
const CATALOG_API = 'http://localhost:8082/api/v1';

async function seedData() {
    try {
        console.log('1. Registering a dummy vehicle owner...');
        const ownerReg = await axios.post(`${USER_API}/auth/register`, {
            email: 'owner@rentease.com',
            password: 'Password@123',
            name: 'Nimal Perera',
            phone: '0771234567',
            role: 'OWNER'
        }).catch(err => {
            console.log('Owner might already exist, proceeding to login...');
        });

        console.log('2. Logging in as owner to get token...');
        const loginRes = await axios.post(`${USER_API}/auth/login`, {
            email: 'owner@rentease.com',
            password: 'Password@123'
        });
        
        const token = loginRes.data.token;
        const ownerId = loginRes.data.userId;
        
        console.log(`Login successful. Owner ID: ${ownerId}`);

        const authConfig = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const vehicles = [
            {
                ownerId: ownerId,
                brand: 'Toyota',
                model: 'Axio',
                year: 2018,
                category: 'SEDAN',
                transmission: 'AUTO',
                fuel: 'PETROL',
                seats: 5,
                hasAC: true,
                baseKmPerDay: 100,
                extraRatePerKm: 50,
                dailyRate: 8500,
                city: 'Colombo',
                district: 'Colombo',
                primaryImageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
                description: 'Well maintained comfortable sedan. Perfect for city rides and long distance.'
            },
            {
                ownerId: ownerId,
                brand: 'Honda',
                model: 'Vezel',
                year: 2019,
                category: 'SUV',
                transmission: 'AUTO',
                fuel: 'HYBRID',
                seats: 5,
                hasAC: true,
                baseKmPerDay: 100,
                extraRatePerKm: 60,
                dailyRate: 12000,
                city: 'Negombo',
                district: 'Gampaha',
                primaryImageUrl: 'https://images.unsplash.com/photo-1568844293986-8d0400ba4724?auto=format&fit=crop&q=80&w=800',
                description: 'Spacious SUV with great fuel economy. Suitable for airport drops and touring.'
            },
            {
                ownerId: ownerId,
                brand: 'Suzuki',
                model: 'Alto',
                year: 2017,
                category: 'HATCHBACK',
                transmission: 'MANUAL',
                fuel: 'PETROL',
                seats: 4,
                hasAC: true,
                baseKmPerDay: 100,
                extraRatePerKm: 40,
                dailyRate: 4500,
                city: 'Kandy',
                district: 'Kandy',
                primaryImageUrl: 'https://images.unsplash.com/photo-1620023640232-0050807b5a8d?auto=format&fit=crop&q=80&w=800',
                description: 'Budget friendly car for quick rides.'
            },
            {
                ownerId: ownerId,
                brand: 'Toyota',
                model: 'KDH',
                year: 2016,
                category: 'VAN',
                transmission: 'AUTO',
                fuel: 'DIESEL',
                seats: 12,
                hasAC: true,
                baseKmPerDay: 150,
                extraRatePerKm: 70,
                dailyRate: 15000,
                city: 'Galle',
                district: 'Galle',
                primaryImageUrl: 'https://images.unsplash.com/photo-1522041203875-101188afbeaf?auto=format&fit=crop&q=80&w=800',
                description: 'Large van ideal for family trips and tourism.'
            },
            {
                ownerId: ownerId,
                brand: 'TVS',
                model: 'NTORQ',
                year: 2021,
                category: 'SCOOTER',
                transmission: 'AUTO',
                fuel: 'PETROL',
                seats: 2,
                hasAC: false,
                baseKmPerDay: 50,
                extraRatePerKm: 20,
                dailyRate: 2500,
                city: 'Ella',
                district: 'Badulla',
                primaryImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
                description: 'Easy to ride scooter to explore the mountains.'
            },
            {
                ownerId: ownerId,
                brand: 'Bajaj',
                model: 'RE',
                year: 2020,
                category: 'TUK_TUK',
                transmission: 'MANUAL',
                fuel: 'PETROL',
                seats: 3,
                hasAC: false,
                baseKmPerDay: 80,
                extraRatePerKm: 30,
                dailyRate: 3500,
                city: 'Colombo',
                district: 'Colombo',
                primaryImageUrl: 'https://images.unsplash.com/photo-1626307416956-628d0b28ec60?auto=format&fit=crop&q=80&w=800',
                description: 'Iconic Sri Lankan Tuk Tuk. Available for self drive for adventurous travelers.'
            }
        ];

        console.log('3. Adding vehicles to catalog...');
        for (let i = 0; i < vehicles.length; i++) {
            const v = vehicles[i];
            try {
                await axios.post(`${CATALOG_API}/vehicles`, v, authConfig);
                console.log(`✅ Added: ${v.brand} ${v.model} (${v.city})`);
            } catch (err) {
                console.error(`❌ Failed to add ${v.brand} ${v.model}:`, err.response?.data?.message || err.message);
            }
        }
        
        console.log('\n🎉 Database Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding data:', error.response?.data || error.message);
    }
}

seedData();
