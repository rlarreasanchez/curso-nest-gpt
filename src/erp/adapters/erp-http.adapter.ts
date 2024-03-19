import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';
import axios, { AxiosInstance } from 'axios';

import { HttpAdapter } from '@common/interfaces';

@Injectable()
export class ErpHttpAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private async getToken(): Promise<string | null> {
    try {
      const token: string = await this.cacheManager.get('token');

      if (token) {
        return token;
      }

      const response = await this.axios.post(
        process.env.OAUTH_BASE_URL,
        `scope=${process.env.OAUTH_SCOPE}&grant_type=client_credentials`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(process.env.OAUTH_CLIENT_ID + ':' + process.env.OAUTH_CLIENT_SECRET).toString('base64')}`,
          },
        },
      );

      if (!response.data?.access_token) return null;

      const { access_token, expires_in } = response.data;

      await this.cacheManager.set('token', access_token, expires_in ?? 3599);

      return access_token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async get<T>(url: string): Promise<T> {
    try {
      const token = await this.getToken();

      if (!token) throw new Error('No token');

      const { data } = await this.axios.get<T>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      throw new Error('Error getting data from ERP');
    }
  }
}
