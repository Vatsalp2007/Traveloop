const admin = require('firebase-admin');
const cities = require('./cities.json');
const activitiesData = require('./activities.json');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`   🗑️  Cleared ${snapshot.size} existing ${collectionName}`);
}

async function seed() {
  console.log('🌱 Seeding Traveloop database...\n');

  // Clear existing data first
  await clearCollection('cities');
  await clearCollection('activities');

  const batch = db.batch();
  const cityIdMap = {};

  // 1. Seed cities
  console.log('📍 Seeding cities...');
  for (const city of cities) {
    const ref = db.collection('cities').doc();
    batch.set(ref, {
      ...city,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    cityIdMap[city.name] = ref.id;
  }
  console.log(`   ${cities.length} cities prepared`);

  // 2. Seed activities linked to cities
  console.log('\n🎯 Seeding activities...');
  let activityCount = 0;

  for (const activity of activitiesData) {
    const cityName = activity.city;
    const cityId = cityIdMap[cityName];

    if (!cityId) {
      console.log(`  ⚠️  Skipping "${activity.name}" — city "${cityName}" not found`);
      continue;
    }

    const ref = db.collection('activities').doc();
    batch.set(ref, {
      cityId: cityId,
      name: activity.name,
      type: activity.type,
      cost: activity.cost,
      duration: activity.duration,
      description: activity.description,
      rating: activity.rating,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    activityCount++;
  }
  console.log(`   ${activityCount} activities prepared`);

  // 3. Stats document
  console.log('\n📊 Adding stats document...');
  batch.set(db.collection('stats').doc('global'), {
    totalUsers: 0,
    totalTrips: 0,
    tripsThisWeek: 0,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 4. Commit everything in one batch
  console.log('\n⏳ Committing batch...');
  await batch.commit();

  console.log('\n✨ Seeding complete!');
  console.log(`   ${cities.length} cities`);
  console.log(`   ${activityCount} activities`);
  console.log(`   Stats document created`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
