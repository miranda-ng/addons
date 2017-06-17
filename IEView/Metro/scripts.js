// ------
// Message Grouping Script
// Thanks to cpm for this Javascript!
// ------

// Appends text via a hidden <div></div>
function appendGroupMsg() {
   theMsg=document.getElementById("message_current");
   newMsg=document.getElementById("msg_new_grouped");

   if (theMsg && newMsg) {
      theMsg.innerHTML+=newMsg.innerHTML;
      // no need to have the info in the log twice (it`s hell on copy and paste)
      newMsg.innerHTML="";
      // we don't want to confuse this w/ the next message.
      newMsg.id="";
   }
}
// this groupped message is done, we don't want to confuse it w/ the next group
function endGroupMsg() {
   theMsg=document.getElementById("message_current");

   if (theMsg) {
      theMsg.id="message_history";
   }
}