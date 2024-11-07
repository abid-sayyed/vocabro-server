// import CustomError from '@src/utils/customError';
import CustomError from './customError';

class EntityNotFoundError extends CustomError<ErrorCode> {}
export default EntityNotFoundError;
