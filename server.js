const express = require('express');
const cors = require('cors');
const { saveClickEvent } = require('./database');

const app = express();
const port = 4000; // 이벤트 서버 포트

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000', // 프론트엔드의 출처 URL
    credentials: true // 자격 증명 허용
}));

app.use(express.json());

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKERS],
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
    },
    ssl: true, // SSL 암호화를 사용해야 함
});

// Producer 생성
const producer = kafka.producer();
const runProducer = async () => {
    try {
        console.log('Connecting to Kafka producer...');
        await producer.connect();
        console.log('Kafka producer connected.');
    } catch (error) {
        console.error('Error connecting to Kafka producer:', error);
    }
};
runProducer().catch(console.error);

// 클릭 이벤트 기록을 위한 API 엔드포인트
app.post('/api/click', async (req, res) => {
    const { id, clickType } = req.body;

    if (!id || !clickType) {
        return res.status(400).json({ message: 'Missing id or clickType' });
    }

    try {
        await saveClickEvent(id, clickType);
        res.status(200).json({ message: 'Click recorded successfully' });
    } catch (error) {
        console.error('Error recording click:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Event server is running on http://localhost:${port}`);
});
