
import { Request } from 'express';
import { IAuthPayload, User } from 'src/database/entity/user.entity';
 
interface RequestWithUser extends Request {
  user: IAuthPayload;
}
 
export default RequestWithUser;