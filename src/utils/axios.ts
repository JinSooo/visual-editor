import Axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
const BASE_URL = ''
const TIME_OUT = 10 * 1000

type AxiosMethod = 'get' | 'post'

const instance = Axios.create({
	baseURL: BASE_URL,
	timeout: TIME_OUT,
})

// axios拦截器
instance.interceptors.response.use(
	(res: AxiosResponse) => {
		if (String(res.status).indexOf('2') !== 0) {
			return {
				code: res.status,
				message: res.data.message || '请求异常，请刷新重试',
				result: false,
			}
		}
		return Promise.reject(res.data)
	},
	(error: AxiosError) => {
		if (error && error.response) {
			return Promise.reject(error.response)
		}
		console.log('网络请求失败, 请刷新重试')
		return Promise.reject(error)
	},
)

// 公用方法
const getPromise = <T = any>(
	method: AxiosMethod,
	url: string,
	params: string,
	config: AxiosRequestConfig = {},
): Promise<T> => {
	return new Promise((resolve, reject) => {
		instance[method](url, config ?? { params })
			.catch((err: any) => err.response.data)
			.then((res: T) => resolve(res))
			.catch((err: any) => reject(err))
	})
}

export const get = <T>(url: string, params?: any) => getPromise<T>('get', url, params)

export const post = <T>(url: string, params: any, config?: AxiosRequestConfig) =>
	getPromise<T>('post', url, params, config)
