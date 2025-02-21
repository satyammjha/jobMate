class ProxyService {
    constructor(proxies) {
      if (!proxies) {
        throw new Error('PROXIES variable is not defined');
      }
      this.proxies = proxies.split(',').map(proxy => {
        const [ip, port, username, password] = proxy.split(':');
        return { ip, port, username, password };
      });
      this.proxyIndex = 0;
    }
  
    getNextProxy() {
      const proxy = this.proxies[this.proxyIndex];
      this.proxyIndex = (this.proxyIndex + 1) % this.proxies.length;
      return proxy;
    }
  
    async rotateProxy() {
      const { ip, port, username, password } = this.getNextProxy();
      return {
        args: [`--proxy-server=${ip}:${port}`],
        proxyCredentials: { username, password },
      };
    }
  }
  
  export default function createProxyService(proxies) {
    return new ProxyService(proxies);
  }