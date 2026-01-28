const db = require('./config/database');

const checkSchema = async () => {
    try {
        const [columns] = await db.execute('SHOW COLUMNS FROM repair');
        console.log('Repair Columns:', columns);

        const [movingColumns] = await db.execute('SHOW COLUMNS FROM moving');
        console.log('Moving Columns:', movingColumns);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSchema();
