const signUpForm = document.getElementById('signUpForm');

        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signUpForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const object = {
                name,
                email,
                password
            }
            
            //so to input fields get emptied once signed up.
            const EmptyNameField = document.getElementById('name');
            const EmptyEmailField = document.getElementById('email');
            const EmptyPasswordField = document.getElementById('password');


            try {
                const response = await axios.post('http://localhost:3000/user/login', object);

                if (response.status === 201) {
                    const manifest = document.getElementById('manifest');
                    manifest.innerHTML = `<p>User : ${response.statusText}</p>`;
                    EmptyNameField.value = "" ; //field gets empty
                    EmptyEmailField.value = "" ; //field gets empty
                    EmptyPasswordField.value = "" ; //field gets empty
                }
            } catch (err) {
                console.log(err);
                const manifest = document.getElementById('manifest');
                manifest.innerHTML = `<p>Error: ${err.message}</p><span style="color:red;"> User Already Exists </span> `;
                EmptyNameField.value = "" ; //field gets empty
                EmptyEmailField.value = "" ; //field gets empty
                EmptyPasswordField.value = "" ; //field gets empty
                
            }
        
        });