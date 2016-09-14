package com.finger.utils;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by zzm on 2016/8/24.
 */

public class Network {

	static String server = "http://172.18.1.166/api/v1/";

	public static PostResult postdata(String uri,JSONObject obj) {
		String urldesc=server+uri;
		PostResult result = new PostResult();
		try {
			// 创建连接
			URL url = new URL(urldesc);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoOutput(true);
			connection.setDoInput(true);
			connection.setRequestMethod("POST");
			connection.setUseCaches(false);
			connection.setInstanceFollowRedirects(true);

			// connection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
			connection.setRequestProperty("Content-Type",
					"application/json; charset=UTF-8");

			connection.connect();

			// POST请求
			DataOutputStream out = new DataOutputStream(connection.getOutputStream());
			// System.out.println(obj.toString());

			// out.writeBytes(obj.toString());//这个中文会乱码
			out.write(obj.toString().getBytes("UTF-8"));// 这样可以处理中文乱码问题
			out.flush();
			out.close();

			// 读取响应
			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String lines;
			StringBuffer sb = new StringBuffer("");
			while ((lines = reader.readLine()) != null) {
				lines = new String(lines.getBytes(), "utf-8");
				sb.append(lines);
			}
			
			JSONObject returnResult = new JSONObject(sb.toString());
			result.setErrno(returnResult.getInt("errno"));
			result.setError(returnResult.getString("error"));
			result.setData(returnResult.getString("data"));
			reader.close();
			// 断开连接
			connection.disconnect();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;

	}

	public static JSONObject getDate(String urlStr) {
		JSONObject result = null;
		BufferedReader in = null;
		InputStream is = null;
		try {
			URL url = new URL(urlStr);
			is = url.openStream();
			in = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			String urlResult = "", line;
			while ((line = in.readLine()) != null) {
				urlResult += line;
			}
			result= new JSONObject(urlResult);

		} catch (Exception ex) {
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					// TODO 自动生成的 catch 块
					e.printStackTrace();
				}
			}
		}
		
		return result;
	}
}
