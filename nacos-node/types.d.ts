export interface ClientOptions {
  endpoint?: string;          // 寻址模式下的对端 host
  serverPort?: number;        // 对端端口
  namespace?: string;         // 阿里云的 namespace
  accessKey?: string;         // 阿里云的 accessKey
  secretKey?: string;         // 阿里云的 secretKey
  httpclient?: any;           // http 请求客户端，默认为 urllib
  appName?: string;           // 应用名，可选
  ssl?: boolean;              // 是否为 https 请求
  refreshInterval?: number;   // 重新拉去地址列表的间隔时间
  contextPath?: string;       // 请求的 contextPath
  clusterName?: string;       // 请求的 path
  requestTimeout?: number;    // 请求超时时间
  defaultEncoding?: string;   // 请求编码
  serverAddr?: string;        // 用于直连，包含端口
  unit?: string;              // 内部单元化用
  nameServerAddr?: string;    // 老的兼容参数，逐步废弃，同 endpoint
  cacheDir?: string;          // 缓存文件的路径
}