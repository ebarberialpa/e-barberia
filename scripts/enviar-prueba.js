import admin from "firebase-admin";
import nodemailer from "nodemailer";

// Inicializar Firebase

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Leer un documento de prueba

const snap = await db
    .collection("configuracion")
    .doc("empresa")
    .get();

console.log("Documento leído:", snap.exists);

// Configurar Gmail

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.GMAIL_USER,

        pass: process.env.GMAIL_APP_PASSWORD

    }

});

// Enviar email

await transporter.sendMail({

    from: process.env.GMAIL_USER,

    to: process.env.GMAIL_USER,

    subject: "Prueba GitHub Actions",

    html: `
        <h2>¡Todo funciona!</h2>

        <p>Firebase y Gmail están correctamente configurados.</p>

        <p>${new Date()}</p>
    `
});

console.log("Correo enviado correctamente.");
