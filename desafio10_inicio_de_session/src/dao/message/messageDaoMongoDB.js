import mongoDBContainer from "../../container/mongoDBContainer.js";
import messages from "../../../schemas/messages.js"


export default class messageDaoMongoDB extends mongoDBContainer{


    constructor() {
        super(messages);
    }    
} 

