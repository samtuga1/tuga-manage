exports.randomCharacters = (length: number) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let verificationCode: string = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      verificationCode += characters.charAt(randomIndex);
    }
  
    return verificationCode;
  }