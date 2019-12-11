/* eslint-disable camelcase */
const qs = require('querystring');

const sign = require('./sign');
const util = require('./util');
const createReq = require('./create-req');

/**
 * 音视频异步处理
 * @type {module.Client}
 * @link https://help.upyun.com/knowledge-base/av/#e5bfabe9809fe585a5e997a8
 */

module.exports = class Client {
  constructor(service_name, operator, password) {
		this.endpoint = 'http://p0.api.upyun.com';

		this.service = {
			name: service_name,
			operator,
			password: util.md5(password),
		};

    this.req = createReq(this.endpoint, this.service, sign.getHeaderSign);
  }

  /**
   * 预处理
   * @param params
   */
  async pretreatment(params) {
    return this.req('/pretreatment', {
    	data: qs.stringify(params),
			method: 'POST',
      headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				accept: 'json',
			},
		}).then(function (response) {
			return response.data
		})
  }

  /**
   * 进度查询
   * @param {String|Array<String>} taskIds
   */
  async progress(taskIds) {
  	if (typeof taskIds === 'string') {
  		taskIds = [taskIds];
		}
    return this.req.get(`/status?service=${this.service.name}&task_ids=${taskIds.join(',')}`)
		.then(function (response) {
			return response.data;
		})
  }

	/**
   * 查询处理结果
	 * @param {String|Array<String>} taskIds
	 */
  async result(taskIds) {
		if (typeof taskIds === 'string') {
			taskIds = [taskIds];
		}
		return this.req({
			url: `/result?service=${this.service.name}&task_ids=${taskIds.join(',')}`,
			method: 'GET',
		}).then(function (response) {
			return response.data;
		})
	}
};
