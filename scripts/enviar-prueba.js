import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import nodemailer from "nodemailer";

// Leer el JSON del Secret
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Inicializar Firebase (solo una vez)
if (!getApps().length) {
    console.log(process.env.FIREBASE_DATABASE_URL);
    initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

// Obtener referencia a Realtime Database
const db = getDatabase();

// Leer un nodo de prueba
const snapshot = await db.ref("ajustes/horasCancelacion").get();

console.log("Datos leídos:");
console.log(snapshot.val());
console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("PASS existe:", process.env.GMAIL_PASSWORD !== undefined);
console.log("PASS longitud:", process.env.GMAIL_PASSWORD?.length);

// Configurar Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Enviar correo
await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: "Prueba GitHub Actions",
    html: `
        <h2>✅ Todo funciona</h2>
        <p>La GitHub Action ha podido:</p>
        <ul>
            <li>Conectarse a Firebase Realtime Database.</li>
            <li>Leer datos.</li>
            <li>Enviar un correo mediante Gmail.</li>
        </ul>
        <p>Fecha: ${new Date().toLocaleString("es-ES")}</p>
    `
});

console.log("Correo enviado correctamente.");
