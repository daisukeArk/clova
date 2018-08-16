import * as Clova from '@line/clova-cek-sdk-nodejs';

/**
 * Clova Extension Client
 */
export class ClovaExtensionClient {
  /**
   * インテントハンドラ
   */
  private handlers: RequestHandler[];

  /**
   * エラーハンドラ
   */
  private errorHandlers: IErrorHandler[];

  /**
   * コンストラクタ
   */
  constructor() {
    this.handlers = [];
    this.errorHandlers = [];
  }

  /**
   * ハンドラ呼出
   * @param handlerInput コンテキスト
   */
  public async invoke(handlerInput: Clova.Context): Promise<void> {
    try {
      let target: RequestHandler | null = null;

      for (const requestHandler of this.handlers) {
        if (await requestHandler.canHandle(handlerInput)) {
          target = requestHandler;
          break;
        }
      }

      if (target == null) {
        throw Error('Not Found IntentHandler.');
      }
      await target.handle(handlerInput);
      return;
    } catch (error) {
      if (this.errorHandlers.length > 0) {
        let errorHandler: IErrorHandler | null = null;

        for (const handler of this.errorHandlers) {
          if (await handler.canHandle(handlerInput, error)) {
            errorHandler = handler;
          }
        }

        if (errorHandler) {
          await errorHandler.handle(handlerInput, error);
          return;
        }
      }

      throw error;
    }
  }

  /**
   * インテントハンドラ追加
   * @param requestHandlers インテントハンドラ
   */
  public addRequestHandlers(...handlers: RequestHandler[]): this {
    for (const handler of handlers) {
      this.handlers.push(handler);
    }
    return this;
  }

  /**
   * エラーハンドラ追加
   * @param errorHandlers エラーハンドラ
   */
  public addErrorHandlers(...handlers: IErrorHandler[]): this {
    for (const handler of handlers) {
      this.errorHandlers.push(handler);
    }

    return this;
  }
}

/**
 * インテントハンドラ インタフェース
 */
export interface RequestHandler {
  canHandle(handlerInput: Clova.Context): Promise<boolean> | boolean;
  handle(handlerInput: Clova.Context): Promise<void> | void;
}

/**
 * エラーハンドラ インタフェース
 */
export interface IErrorHandler {
  canHandle(handlerInput: Clova.Context, error: Error): Promise<boolean> | boolean;
  handle(handlerInput: Clova.Context, error: Error): Promise<void> | void;
}
