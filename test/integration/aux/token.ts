export const getToken = async(app: any, request: any) => await request(app.getHttpServer())
.post('/login')
.send({
  email: 'company@email.com',
  password: 'password',
})
.then(async response => {
  return response.body.token
})