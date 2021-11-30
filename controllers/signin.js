const handleSignIn = (db, bcrypt)=>(req, res)=>{

  const {email, password} =req.body

  if (!email || !password){
    return res.status(400).json("Incorrect Form Submission")
  }

  db.select('email', 'hash').from('login')
    .where({email:email})
    .then(data=>{
      const isValid= bcrypt.compareSync(password, data[0].hash); // true
      if (isValid){
        db.select('*').from('users')
        .where({email:email})
        .then(user=>{
          return res.json(user[0])
        })
        .catch(err=>res.status(400).json('Invalid password'))
      }else{
        res.status(400).json('Invalid email or password')
      }
    })
    .catch(err=>res.status(400).json('Email or Password not yet registered'))
}

module.exports = {
  handleSignIn
}