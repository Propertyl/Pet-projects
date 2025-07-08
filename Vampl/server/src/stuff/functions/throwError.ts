import { BadRequestException } from "@nestjs/common";

const throwServerError = () => {
  throw new BadRequestException('Something went wrong!', {
    cause:new Error(),
    description:'Server can get things right'
  });
}
 
export default throwServerError;