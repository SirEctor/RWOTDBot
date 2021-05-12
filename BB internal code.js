//1fe0bb04-ac3d-4aab-8bff-ffb17ad38b9d => Fiendship
//https://stackoverflow.com/questions/25722682/iterate-over-an-object-in-google-apps-script
//be408032095f402e8a4a9961eaee2912 => api
//https://api.voicerss.org/?<parameters>
//"https://api.voicerss.org/?key=be408032095f402e8a4a9961eaee2912&hl=en-gb&src="RANDOM WORD OF THE DAY: Word: " + randomWord + " Definition: " + randomWordDefinition"
//mine - f2ba9083-a607-4440-8bb2-c8c496770fa5


//An array to hold a list of the name/labels of all currently connected
var members = [ "B", "G", "Chat 1", "Actual Chat 2", "Chat 3","Chat 4","Chat 5", "Chat 6" ];

//An array to hold the ids of the areas connected. The two arrays are equal on a one-to-one basis. Ex: members[0] has the id of memberids[0]
var memberids = ["4d0e5c14-4733-4b86-94e1-78f9efbf5e2f","53b9e5cc-0ef8-44c7-b2d6-829850ac4cb2","ad05ef83-76f6-40f5-bc97-dd2301049fa1", "c06b7508-5242-49db-b692-35a3bf12582d","ef060548-b02f-4ae5-a66d-94d4d28a2ed4","53f4f52b-a1a8-4a22-aa9e-1ad40494a93e","5015e325-8c33-4ad5-b3fb-048cbff78024","731a6e38-7841-4aef-89a6-04fa95a294b0"];

     
//A function to get the Random Word and Defintion from randomword.com and send it out daily.      
function randomWord(){
  //Gets the total page - html and all
  var totalPage = UrlFetchApp.fetch("https://randomword.com").getContentText();
  
  //Defines the div of random word and definition to be searched for later
  var searchRW = '<div id="random_word">';
  var searchRWD = '<div id="random_word_definition">';
  
  //The index of the random word is static, but since the definition comes afterward, it must be searched for using the searchRW
  var RWindex = totalPage.indexOf(searchRW);
  var RWDindex = totalPage.indexOf(searchRWD);
  
  
  //Used to get the rest of the page after the div starting tags so the ending tags can be found later
  var restOfPageRW = totalPage.substr(RWindex+searchRW.length);
  var restOfPageRWD = totalPage.substr(RWDindex+searchRWD.length);
  
  //Defines the ending tags to be found
  var searchRWEnd = '</div>';
  var searchRWDEnd = '</div>';
  
  //Finds the index of the closing div of the word and definition respectively
  var RWindexEnd = restOfPageRW.search(searchRWEnd);
  var RWDindexEnd = restOfPageRWD.search(searchRWDEnd);
  
  //Gets the random word by returning the string from the start index plus the length of the starting div all the way to the end index
  var randomWord = totalPage.substring(RWindex+searchRW.length,RWindex+searchRW.length+RWindexEnd);
  var randomWordDefinition = totalPage.substring(RWDindex+searchRWD.length,RWDindex+searchRWD.length+RWDindexEnd);
 
  //Sends out the random word and definition to all
  for (var i = 0; i < members.length; i++){
      var email = "chat+" + memberids[i] + "@mail.remind.com";
      MailApp.sendEmail(email, "","RANDOM WORD OF THE DAY:\nWord: " + randomWord + "\nDefinition: " + randomWordDefinition);
  
  }
 
  //Logger.log("RANDOM WORD OF THE DAY:\nWord: " + randomWord + "\nDefinition: " + randomWordDefinition);
  
}
    
//A function to test if any new messages have been sent in one instance, then to spread it out to all the other instances if found    
function test(){
    //Loops through all the memberids to see if any of them sent messages 
    for (var i = 0; i < members.length; i++){
        //Gets the label from the specific member id
        var label = GmailApp.getUserLabelByName(members[i]);
    
        //Allows operation only if label exists so no failures should occur
        if(label == null){    
            //The label doesn't exist, this shouldn't be happening though!
            Logger.log(members[i]+" doesn't exist");
        }
        else{
           //Allows operation only if the label count is greater than one so no failure should occur 
           if(label.getUnreadCount() == 0){
               //There are no messages from that label so there is no point continuing
               Logger.log(members[i] + " hasn't sent any messages");
           }
           else{
           //Removes the sender from the memberids so messages won't be sent to that group
           //var sender = memberids.splice(i,1);
        
           //Attempts to get three new messages from Inbox
           var threeds = label.getThreads(0,3);
       
           //Loops through all the messages gained
           for (var j = 0; j < threeds.length; j++) {
               // Gets the subject and body for each of the three messages
               var msg = threeds[j].getMessages();
               subject = msg[0].getSubject();
               body = msg[0].getPlainBody();
               
               //Gets the date
               var date = msg[0].getDate();
               Logger.log(date);
               
               //Loops through all the rest of the memberids  
               for(var k = 0; k < memberids.length; k++){
                   if(memberids[k] == memberids[i]){
                      //Don't send the message to this group cause they're the ones who sent it 
                   }
                   else{
                       //Sends the subject and body to all of the rest of the memberids
                       MailApp.sendEmail("chat+"+memberids[k]+"@mail.remind.com","","Time:"+ date + "\n"+ subject + "\n" + body); 
                   }
               }
              //Removes the label from the messages after taken
              threeds[j].removeLabel(label);
          }
           // Adds the sender back in the memberids
           //memberids.splice(k,0,sender.toString());
           //Logger.log(memberids);
           
             
         }
       } 
    }
}

function pronounce(){
  var message = { 
    to: "chat+f2ba9083-a607-4440-8bb2-c8c496770fa5@mail.remind.com",
    subject: "",
    htmlBody: 'Pronounciation -' +'\n' + 'https://api.voicerss.org/?key=be408032095f402e8a4a9961eaee2912&hl=en-gb&src=RANDOM%20WORD%20OF%20THE%20DAY:Word:' +'extravasate' + 'Definition:' + 'to%20let%20out%20of%20the%20proper%20vessels;%20to%20flow%20out'
  };
  
  
  MailApp.sendEmail(message);                                                                                                                                                                                           
  
 // Logger.log(sound.getAs("audio/wav"));
  
 
}

function spread(word, defa){
  var worda = word;
  var spread = stlit(defa)
  var news = "".join('%20' + defa);
  Logger.log(news)


}

//A function to create a minuteTrigger of the test function
function createTrigger() {
    //Sends out good morning message to all
    //for (var i = 0; i < members.length; i++){
    //    GmailApp.sendEmail("chat+"+memberids[i]+"@mail.remind.com", "", "Bot starting up for the day!!!")
    //} - Wastes quota
    
    //Triggers the test function every minute
    ScriptApp.newTrigger('test')
        .timeBased()
        .everyMinutes(1)
        .create();
}

//A function to delete the minuteTrigger of the test function at a given time
function deleteTrigger() {
    //Sends out good night message to all
    //for (var i = 0; i < members.length; i++){
    //    GmailApp.sendEmail("chat+"+memberids[i]+"@mail.remind.com", "", "Bot going to sleep for the night!!!\nGood night!")
    //} - Wastes quota
  
    //Gets all project triggers
    var allTriggers = ScriptApp.getProjectTriggers();
    
    // Loop over all triggers.
    for (var i = 0; i < allTriggers.length; i++) {
        // If the current trigger is the correct one, delete it.
        if (allTriggers[i].getHandlerFunction() == "test") {
            ScriptApp.deleteTrigger(allTriggers[i]);
            break;
        }
    }
}
