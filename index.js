 // index.js
 
 let mergedData = [];
 const readline = require("readline")

 const rl = readline.createInterface({
     input: process.stdin, 
     output: process.stdout,
 })
 
 function ask(question) {
    return new Promise((resolve, reject) => {

        rl.question(question, (answer) => {
            resolve(answer);
                });
    });
     
            
 }
 
 const mergeData = (data) => {
     
    mergedData = mergedData.concat(data);
    //reducing down the duplicates 
    mergedData = mergedData.reduce((acc, d) => {
        //checking if theres a name in the accumlator with an intersection of emails 
        const found = acc.filter(a => {
            return a.emails?.filter(x => d.emails?.includes(x)).length > 0});
            
        //found items that intersect    
        if(found.length > 0){
            found.forEach(a => {
                const interstection = a.emails?.filter(x => d.emails?.includes(x));
                let difference = a.emails?.filter(x => !d.emails?.includes(x))
                    .concat(d.emails?.filter(x => !a.emails?.includes(x)));
                    //takes out the duplicates by adding the intersection and differences
                    d.emails = interstection.concat(difference);
                    //if application is just a number change to an array
                if(!d.application.toString()?.includes(a.application)){
                    if(typeof d.application === "number" || typeof d.application === "string"){
                        d.application = [d.application];
                    }
                    d.application.push(a.application);

                }
            })
        }
        //push the new object
        acc.push(d);

        //take out the duplicates that have been merged
        acc = acc.filter(x => !found.includes(x));

        return acc;
        }, []);
        console.log(mergedData);
        
      
    //console.log(mergedData);
 }
 const main = async () => {
    let data = {};
    let oneMore = true;
    while(oneMore){
        const input = await ask("Are you inputting a file(Y/N) ")
    if(input.toUpperCase() === 'Y'){
        const inputFile = await ask("The file location is: ");
        console.log(inputFile);
         data = require(`${inputFile}`);
         mergeData(data);
    }else if(input.toUpperCase() === 'N'){
        const lineByLine = await ask("Please select number according to your choice: \n" + 
        "1. inputting an object\n" +
        "2. inputting through a series of questions\n");
        if(lineByLine === "1"){
            data = await ask("Please enter object: \n");
            data = JSON.parse(data)
            
        }else if(lineByLine === "2"){
            const applicationNum = await ask("Enter Application Number: \n");
            let moreEmail = true;
            let email = [];
            while(moreEmail){
                email.push( await ask("Please Enter Email: \n"));
                moreEmail = await ask("Add more email?: (Y/N)\n").then(e => e.toUpperCase() === 'Y');
            }
            email = email.filter(e => e != "");
            const name = await ask("What's your name: \n");
            if(!isNaN(Number(applicationNum)) && email.length > 0 && name != ""){
                data = {
                    application : Number(applicationNum),
                    emails : email,
                    name: name
                };
            }else{
                console.log("Incorrect Info");
                break;
            }
            
        }
        mergeData([data]);

    }else{
        console.log("please enter the correct info");
    }
    oneMore = await ask("Add More Info? (Y/N) ").then(e => e.toUpperCase() === 'Y');
    }
    
    
    rl.close();
  }
  
  main()
 


