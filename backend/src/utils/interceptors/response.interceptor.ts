import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
import { Response } from 'express'; 
import { IResponse } from './interfaces/response.interface';

@Interceptor()
export class ResponseInterceptor implements InterceptorInterface {
    
  /**
   * This method intercepts the response from the server and formats it. 
   * @param action - The action being intercepted
   * @param content - The content of the response
  */
  intercept(action: Action, content: IResponse<Object>) {
    const response: Response = action.response;
    const statusCode = response.statusCode;
    
    const formattedResponse: any = {
      status: statusCode,
      data: content?.data || content,
      message: content?.message || '',
    };

    if (content.pagination) formattedResponse.pagination = content.pagination;

    return formattedResponse;
  }
}