const mailData = (receiver, token) => {
  return {
    from: "mariusz.dev.test@gmail.com",
    to: receiver,
    subject: "Confrim your email",
    text: `${token}`,
    html: ` <b> To confim adress open link below. </b>
            <br>
            <a href="http://localhost:${process.env.PORT}/confirmation?token=${token}"> Confirm your email adress </a>
            </br>`,
  };
};

module.exports = mailData;
