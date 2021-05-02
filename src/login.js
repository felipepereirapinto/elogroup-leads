const Password = {
  pass1: document.getElementById('password'),
  pass2: document.getElementById('password2'),

  // Customiza a validação de senha para só dar submit quando der match
  validate(){
    if(this.pass1.value != this.pass2.value) {
      this.pass2.setCustomValidity('Password e confirmação devem ser iguais')
    } else {
      this.pass2.setCustomValidity('');
    }
  }
}
