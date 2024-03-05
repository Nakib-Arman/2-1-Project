const LogIn = async e => {
    e.preventDefault();
    try {
      const body = { PHONE, PASSWORD };
      /*const studentresponse = await fetch("http://localhost:5000/studentLogIn", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body)});
      const teacherresponse = await fetch("http://localhost:5000/teacherLogIn", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body)});
      const staffresponse = await fetch("http://localhost:5000/staffLogIn", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body)});
      const userresponse = await fetch("http://localhost:5000/userLogIn", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body)});
      const type=await fetch(`http://localhost:5000/userLogIn/${PHONE}`);
      const jd=await type.json();
      console.log(jd[0].user_type);
      const u_type=jd[0].user_type;
      console.log(u_type);
      if(userresponse.ok){
        try{
          const jsonData = await userresponse.json();
          if(u_type=="student"){
            navigate('/showBooks');
          }
          else if(u_type=="teacher"){
            navigate('/showBooks');
          }
          else if(u_type=="staff"){
            navigate(`/${jd[0].user_id}`);
          }
        }catch(err){
          console.log(err.message);
        }
      }
      else if(staffresponse.ok){
        try{
          console.log(PHONE);
          const staff = await fetch(`http://localhost:5000/staffLogIn/${PHONE}`);
          const type=await fetch(`http://localhost:5000/userLogIn/${PHONE}`);
          const jd=await type.json();
          console.log(jd[0].user_type);
          const jsonData = await staff.json();
          
        // navigate('/showBooks');
          navigate(`/${jsonData[0].staff_id}`);
        }catch(err){
          console.log(PHONE);
          console.log(err.message);
        }
      }
      else if(studentresponse.ok || teacherresponse.ok){
        navigate('/showBooks');
      }
      else {
          alert("Wrong Phone or Password");
      }*/
      const response = await fetch("http://localhost:5000/LogIn", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("token", user.token);
        //setAuth(true);

        const typeResponse = await fetch(`http://localhost:5000/userLogIn/${PHONE}`);
        const userTypes = await typeResponse.json();
        const userType = userTypes[0].user_type;

        switch (userType) {
          case "student":
            setAuth(true);
            navigate('/HomePageForStudentTeacher');
            break;
          case "teacher":
            setAuth(true);
            navigate('/showBooks');

            break;
          case "staff":
            setAuth(true);
            navigate('/');

            break;
          default:
            alert("Unknown user type");
        }

      }
      else {
        alert("Wrong Phone or Password");
      }

    } catch (err) {
      console.log(err.message);
    }
  }