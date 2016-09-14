package com.finger.service;

import java.io.UnsupportedEncodingException;
import java.lang.ref.WeakReference;
import java.util.ArrayList;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.finger.activity.Gdata;
import com.finger.utils.Network;
import com.finger.utils.Utils;
import com.theme.finger.print.Device;
import com.theme.finger.print.Device.OnRecvCharListener;
import com.theme.finger.print.Device.OnVerifyListener;

import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

public class MyService extends Service {
	
	private  static boolean bgetchar=false;
	private final static String TAG = "Finger MyService";
	Gdata app;
	private static Device mDevice;
	MsgHandler handler =  new MsgHandler(MyService.this);

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
		app = (Gdata)getApplication();  
		mDevice = app.getmDevice();
		if (mDevice != null) {
			//mDevice.cancel();
			identify();
		}
		else
		{
			Log.i(TAG, "onCreate1111111");
		}
	}
	
	public void identify(){
		Log.i(TAG, "identify");
		if(mDevice==null)
		{
			return;
		}
		
		mDevice.identify(false, new OnVerifyListener() {
			private String result = "";
			
			@Override
			public void onFailed(int errorCode) {
				if(Utils.isidentify)
				{
					mDevice.cancel();
					return;
				}
				Log.i(TAG, result+errorCode);
			}

			@Override
			public void onBitmapProgress(int percent, int current, int count) {
				// mTxtInfo.setText(getString(R.string.string_recv_bimap_percent,
				// percent));
			}

			@Override
			public void onBitmap(Bitmap bitmap) {
				if(Utils.isidentify)
				{
					mDevice.cancel();
					return;
				}
				// mImageView.setBackground(new
				// BitmapDrawable(getScaleBitmap(bitmap)));
			}

			@Override
			public void onStartVerify(int index) {
				if(Utils.isidentify)
				{
					mDevice.cancel();
					return;
				}
				
				result ="index"+index;
				//Log.i(TAG, result);
			}

			@Override
			public void onEndVerify(int index) {
				if(Utils.isidentify)
				{
					mDevice.cancel();
					return;
				}
				
				result ="index"+index;
				//Log.i(TAG, result);
				// mTxtInfo.setText(getString(R.string.string_collect_end));
				//Toast.makeText(MyService.this, result, Toast.LENGTH_LONG).show();
			}

			@Override
			public void onVerifySuccess(int id, boolean updated, int useTime) {
				if(Utils.isidentify)
				{
					mDevice.cancel();
					return;
				}
				
				if (useTime > 100) {
					useTime -= 100;
				}
				
				if (id > 0) {
					Log.i(TAG, "identify="+id);
					mDevice.cancel();
					getChar(id);
				} else {
					//Log.i(TAG, "identify111");
					Log.i(TAG, "identify failed="+id);
//					result = getString(R.string.string_verify_failed,
//							useTime);
				}
			}
		});
	}
	
	private  void getChar(int id) {
		if(bgetchar==false)
		{
			bgetchar=true;
			mDevice.getChar(id, new OnRecvCharListener() {

				@Override
				public void onFailed(int errorCode) {
					//Toast.makeText(MyService.this, "失败"+errorCode, Toast.LENGTH_LONG).show();
					Log.i(TAG, "identify failed 失败");
					
					if(Utils.isidentify)
					{
						mDevice.cancel();
						return;
					}
					bgetchar=false;
					identify();
					
					//mTxtInfo.setText(getErrMessage(errorCode));
				}

				@Override
				public void onRecvChar(int id, byte[] chars) {
				
					if(Utils.isidentify)
					{
						mDevice.cancel();
						return;
					}
					
					String srt2 = null;
					try {
						srt2 = new String(chars,"UTF-8");
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					Log.i(TAG, "或者特征值="+srt2+"length="+chars.length);
					bgetchar=false;
					identify();
					Toast.makeText(MyService.this, "或者特征值"+srt2, Toast.LENGTH_LONG).show();
//					new Thread(){  
//						   @Override  
//						   public void run()  
//						   {  
//								String uri=Utils.serviceurl+"/manager/v1/finger/signin";
//								ArrayList<NameValuePair> params = new ArrayList<NameValuePair>();
//								params.add(new BasicNameValuePair("deviceid","test"));
	//
//								//params.add(new BasicNameValuePair("parameter","以Post方式发送请求"));
//								String ret = Network.postdata(uri, params);	
//								Log.i(TAG, ret);
//								//Toast.makeText(MyService.this, "网络错误11", Toast.LENGTH_LONG).show();
//						        Message msg = new Message(); 
//						        msg.what=2;
//						        Bundle data = new Bundle();  
//						        data.putString("value", ret);  
//						        msg.setData(data);  
//						       
//								handler.sendMessage(msg);  
	//
//						  }  
//						}.start();
						
						//identify(); 迁移到下面 这样太快了
				}

			});
		}
		
	}
	
	
	static class MsgHandler extends Handler {  
	    private WeakReference<Service> mActivity;  
	  
	    MsgHandler(MyService myService) {  
	        mActivity = new WeakReference<Service>(myService);  
	    }  
	  
	    @Override  
	    public void handleMessage(Message msg) {  
	    	MyService activity = (MyService)mActivity.get();  
	        Bundle data = msg.getData();  
	        String val = data.getString("value");  
	        if (activity != null) {  
	        	//Toast.makeText(activity, val, Toast.LENGTH_LONG).show();
	        	//activity.identify();
	        }  
	    }  
	}  
	

	/*
	 * 结束服务时调用
	 */
	@Override
	public void onDestroy() {
		super.onDestroy();
		//mDevice.destory();
		if(mDevice!=null)
		{
			mDevice.cancel();//
		}
		Log.i(TAG, "onDestroy");
		//System.out.println("onDestroy");
	}

}
