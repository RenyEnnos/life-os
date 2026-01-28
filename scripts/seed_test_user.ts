import 'dotenv/config';
import { supabase } from '../api/lib/supabase';
import bcrypt from 'bcryptjs';

async function seedTestUser() {
    const email = 'test@life-os.app';
    const password = 'TestPass123!';
    const name = 'Test User';

    console.log(`Checking if user ${email} exists...`);

    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        console.log('User already exists:', existingUser.id);
        // Optionally update password if needed, but for now just exit
        process.exit(0);
    }

    if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking user:', checkError);
        process.exit(1);
    }

    console.log('Creating new test user...');
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
        .from('users')
        .insert([{
            email,
            password_hash: passwordHash,
            name,
            preferences: {},
            theme: 'dark'
        }])
        .select()
        .single();

    if (error) {
        console.error('Failed to create user:', error);
        process.exit(1);
    }

    console.log('User seeded successfully:', user.id);
    process.exit(0);
}

seedTestUser();
