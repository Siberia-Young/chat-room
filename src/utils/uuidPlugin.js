// uuidPlugin.js
import { v4 as uuidv4 } from 'uuid';

export default {
  install(app) {
    // 将 uuidv4 函数添加到 app 的配置中，使其在所有组件中都可用
    app.config.globalProperties.$uuidv4 = uuidv4;
  }
};