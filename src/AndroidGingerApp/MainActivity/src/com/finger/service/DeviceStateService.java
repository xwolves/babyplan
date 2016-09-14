package com.finger.service;

import java.util.ArrayList;

import javax.xml.transform.Result;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import com.finger.utils.Network;
import com.finger.utils.PostResult;
import com.finger.utils.Utils;


import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;


public class DeviceStateService extends Service {
	
	private final String TAG = "DeviceStateService";
	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * * 开启服务时调用
	 */
	@Override
	public void onCreate() {
		super.onCreate();


		new Mythread().start();
	}
	
	@Override
	public int onStartCommand(Intent intent, int flags, int startId){
		//new Mythread().start();
		return START_STICKY;		
	}

	private class Mythread extends Thread{
		@Override
		public void run() {
			while (true) {
				try {
					String uri = "device/status/report";
					JSONObject obj = new JSONObject();
					obj.put("deviceid", Utils.getEthernetMacAddress());
					PostResult ret  = (PostResult) Network.postdata(uri,obj);
					Thread.sleep(1000);
					Log.d(TAG, ""+ret.getErrno());
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
	
	/*
	 * 结束服务时调用
	 */
	@Override
	public void onDestroy() {
		super.onDestroy();

	}

}
