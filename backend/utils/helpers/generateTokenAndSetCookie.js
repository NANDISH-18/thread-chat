import jwt from 'jsonwebtoken'
const generatedTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.jwtToken,{
        expiresIn: '15d',

    })

    res.cookie('jwt', token,{
        httpOnly: true, //This cookie can not be assessed by the browser (more secure)
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days,
        sameSite: "strict" //CSRF


    })

    return token;
}

export default generatedTokenAndSetCookie;
