import nodemailer from 'nodemailer';


export const sendWelcomeEmail = async ({
    email,
    name,
    username,
    role
}: {
    email: string;
    name: string;
    username: string;
    role: string;
}) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    const info = await transporter.sendMail({
        from: `Owl Manager <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Bienvenido a Owl Manager',
        html: `
    
        <!DOCTYPE html>
        <html lang="es">

        <head>
            <meta charset="UTF-8" />
            <title>Bienvenido a Owl Manager</title>
        </head>

        <body
            style="
                margin: 0;
                padding: 0;
                background-color: #f4f7fb;
                font-family: Arial, Helvetica, sans-serif;
            "
        >

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
            >
                <tr>
                    <td align="center">

                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                                background-color: #ffffff;
                                overflow: hidden;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                            "
                        >

                            <!-- HEADER -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        background-color: #0f172a;
                                        padding: 40px 20px;
                                    "
                                >

                                    <h1
                                        style="
                                            color: #E8A838;
                                            margin-top: 10px;
                                            margin-bottom: 0;
                                            font-size: 32px;
                                        "
                                    >
                                        Owl Manager
                                    </h1>

                                    <p
                                        style="
                                            color: #9BAABF;
                                            margin-top: 10px;
                                            font-size: 16px;
                                        "
                                    >
                                        Sistema de Gestión Empresarial
                                    </p>

                                </td>
                            </tr>

                            <!-- CONTENT -->
                            <tr>
                                <td style="padding: 40px;">

                                    <h2
                                        style="
                                            margin-top: 0;
                                            color: #0f172a;
                                            font-size: 28px;
                                        "
                                    >
                                        Bienvenido/a, ${name}
                                    </h2>

                                    <p
                                        style="
                                            color: #9BAABF;
                                            font-size: 16px;
                                            line-height: 1.7;
                                        "
                                    >
                                        Un administrador ha creado tu cuenta en
                                        <strong>Owl Manager</strong>.
                                    </p>

                                    <table
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="
                                            margin-top: 30px;
                                            background-color: #f8fafc;
                                            border-radius: 12px;
                                            padding: 20px;
                                        "
                                    >

                                        <tr>
                                            <td
                                                style="
                                                    padding-bottom: 12px;
                                                    color: #9BAABF;
                                                    font-size: 14px;
                                                "
                                            >
                                                Usuario
                                            </td>
                                        </tr>

                                        <tr>
                                            <td
                                                style="
                                                    font-size: 18px;
                                                    font-weight: bold;
                                                    color: #E8A838;
                                                    padding-bottom: 20px;
                                                "
                                            >
                                                ${username}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td
                                                style="
                                                    padding-bottom: 12px;
                                                    color: #9BAABF;
                                                    font-size: 14px;
                                                "
                                            >
                                                Rol asignado
                                            </td>
                                        </tr>

                                        <tr>
                                            <td
                                                style="
                                                    font-size: 18px;
                                                    font-weight: bold;
                                                    color: #E8A838;
                                                "
                                            >
                                                ${role}
                                            </td>
                                        </tr>

                                    </table>

                                    <div
                                        style="
                                            text-align: center;
                                            margin-top: 40px;
                                        "
                                    >

                                        <a
                                            href="${loginUrl}"
                                            style="
                                                background: linear-gradient(135deg, #E8A838, #f7bc56);
                                                color: #ffffff;
                                                text-decoration: none;
                                                padding: 16px 32px;
                                                border-radius: 12px;
                                                font-size: 16px;
                                                font-weight: bold;
                                                display: inline-block;
                                                box-shadow: 0 4px 10px rgba(227, 166, 69, 0.3);
                                            "
                                        >
                                            Ir al Login
                                        </a>

                                    </div>

                                    <p
                                        style="
                                            margin-top: 40px;
                                            color: #64748b;
                                            font-size: 14px;
                                            line-height: 1.7;
                                        "
                                    >
                                        Si no esperabas este correo, puedes ignorarlo.
                                    </p>

                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        background-color: #0f172a;
                                        padding: 30px 20px;
                                    "
                                >

                                    <p
                                        style="
                                            color: #9BAABF;
                                            margin: 0;
                                            font-size: 14px;
                                        "
                                    >
                                        © 2026 Owl Manager. Todos los derechos reservados.
                                    </p>

                                    <p
                                        style="
                                            color: #9BAABF;
                                            margin-top: 10px;
                                            font-size: 12px;
                                        "
                                    >
                                        Proyecto Integrador — Tecnologías de Desarrollo en el Servidor
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `
    });

};
