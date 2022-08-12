export default {
  mail: {
    host: '<smtp-host>',
    port: 587, // 25, 465 or 587
    secure: false, // true if port = 465
    user: '<username>',
    pass: '<password>',
  },
  host: {
    url: '<server-url>',
    port: '3000',
  },
  jwt: {
    expiresId: 36000000,
  },
};
