const forgotPassword = document.getElementById("forgotpassword");
        forgotPassword.addEventListener('submit',async (e)=>{
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const response = await axios.post('http://localhost:3000/user/password/verification',{name:name, email:email});
            if(response.status === 200||response.data.success === true){
                //console.log('has pending finished?');
                const responseOfSMTP = await axios.post('http://localhost:3000/user/password/resetpassword',{email: email});
                if(responseOfSMTP.status===200){
                    document.getElementById('successfullText').innerHTML=`<h5> Password Sent Over mail to ${email}</h5>`;
                }else{
                    console.log('>>>>error in SMTPing');
                }
            }else{
                console.log('failed pending');
            }
        });