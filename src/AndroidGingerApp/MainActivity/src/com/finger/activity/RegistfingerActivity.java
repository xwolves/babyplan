package com.finger.activity;

import java.lang.ref.WeakReference;
import java.util.ArrayList;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.finger.service.MyService;
import com.finger.utils.Network;
import com.finger.utils.Utils;
import com.theme.finger.print.Device;
import com.theme.finger.print.ErrorCode;
import com.theme.finger.print.Device.OnEnrollListener;
import com.theme.finger.print.Device.OnRecvCharListener;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

public class RegistfingerActivity extends Activity implements OnClickListener {

	private final static String TAG = "Finger MyService";

	MsgHandler handler =  new MsgHandler(this);

	private Device mDevice;
	TextView mchildrenid;
	TextView mchildrenname;
	TextView mparentname;
	TextView mparentphone;

	TextView mTxtInfo;

	Button mchoosechrildren;
	ImageView mImageView;

	final int RESULT_CODE = 101;
	final int REQUEST_CODE = 1;
	Gdata app ;
	@Override
	protected void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_registfinger);
		initregfinger();
		app = (Gdata) getApplication();
		mDevice = app.getmDevice();
		
		Log.i(TAG, "onCreate1");
		Intent intent = new Intent(RegistfingerActivity.this, MyService.class);
		stopService(intent);	
		Utils.isidentify=true;
		if (mDevice != null) {
			Log.i(TAG, "mDevice.cancel();");
			mDevice.cancel();
			mTxtInfo.setText("mDevice==null");
		}
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		Toast.makeText(this, "onDestroy", Toast.LENGTH_LONG).show();
		Intent intent = new Intent(RegistfingerActivity.this, MyService.class);
		startService(intent);
		Utils.isidentify=false;
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.registfinger, menu);
		return true;
	}

	private void initregfinger() {
		mchoosechrildren = (Button) findViewById(R.id.choosechrildren);
		mchoosechrildren.setOnClickListener(this);

		mchildrenid = (TextView) findViewById(R.id.echildrenid);
		mchildrenname = (TextView) findViewById(R.id.echildrenname);
		mparentname = (TextView) findViewById(R.id.eparentgname);
		mparentphone = (TextView) findViewById(R.id.eparentphone);

		mTxtInfo = (TextView) findViewById(R.id.id_msg_info);
		mImageView = (ImageView) findViewById(R.id.id_image_finger);
	}

	public void onClick(View v) {
		if (v == mchoosechrildren) {
			Intent intent = new Intent();
			intent.setClass(RegistfingerActivity.this,
					SearchChrildrenActivity.class);
			startActivityForResult(intent, REQUEST_CODE);
		}
	}

	private void startenroll() {
		if(mDevice == null)
		{
			return;
		}
		
		mDevice.enroll(true, new OnEnrollListener() {
			@Override
			public void onEnrollStep(final int step, final int count,
					final boolean retry) {
				mTxtInfo.setText(getString(R.string.string_enrolling, step,
						count));
			}

			@Override
			public void onFailed(final int errorCode) {
				mTxtInfo.setText(getErrMessage(errorCode));
			}

			@Override
			public void onBitmapProgress(int percent, int current, int count) {
				mTxtInfo.setText(getString(R.string.string_recv_bimap_percent,
						percent));
			}

			@Override
			public void onBitmap(Bitmap bitmap) {
				mImageView.setBackground(new BitmapDrawable((bitmap)));
			}

			@Override
			public void onEnrollFinished(final int id) {
				// mSpinnerIds.setSelection(id - 1);
				// mTxtInfo.setText(getString(R.string.string_enroll_success,
				// id));
				//
				// final String conent = "" + mDevice.getCount() + "/" +
				// mDevice.getMaxCount();
				// mTxtEnrollCount.setText(conent);
				
		        Message msg = new Message(); 
		        msg.what=1;
		        Bundle data = new Bundle();  
		        data.putInt("value",id);  
		        msg.setData(data);  
				handler.sendMessage(msg);  
			}

			// @Override
			// public void onBitmap(Bitmap arg0) {
			// // TODO Auto-generated method stub
			//
			// }
		});
	}
	
	static class MsgHandler extends Handler {  
	    private WeakReference<Activity> mActivity;  
	  
	    MsgHandler(Activity activity) {  
	        mActivity = new WeakReference<Activity>(activity);  
	    }  
	  
	    @Override  
	    public void handleMessage(Message msg) {  
	    	Setting activity = (Setting)mActivity.get();  
	        if (activity != null) {  
		        if(msg.what==1)
		        {
			        Bundle data = msg.getData();  
			        int val = data.getInt("value");  
			        Log.i("mylog", "请求结果为-->" + val);  
			        //getChar(val);
		        }
		        else  if(msg.what==2)
		        {
			        Bundle data = msg.getData();  
			        String val = data.getString("value");  
		        	Log.i("mylog", "上传服务器返回-->" + val); 
		        }
	        }  
	    }  
	}  
	
	
	
//	Handler handler = new Handler() {  
//	    @Override  
//	    public void handleMessage(Message msg) {  
//	        super.handleMessage(msg);  
//	        if(msg.what==1)
//	        {
//		        Bundle data = msg.getData();  
//		        int val = data.getInt("value");  
//		        Log.i("mylog", "请求结果为-->" + val);  
//		        //getChar(val);
//	        }
//	        else  if(msg.what==2)
//	        {
//		        Bundle data = msg.getData();  
//		        String val = data.getString("value");  
//	        	Log.i("mylog", "上传服务器返回-->" + val); 
//	        }
//	    }  
//	};
	
	private void getChar(int id) {
		mDevice.getChar(id, new OnRecvCharListener() {

			@Override
			public void onFailed(int errorCode) {
				//mTxtInfo.setText(getErrMessage(errorCode));
			}

			@Override
			public void onRecvChar(int id, byte[] chars) {
				
				Toast.makeText(RegistfingerActivity.this, chars.toString(), Toast.LENGTH_LONG).show();
				new Thread(){  
					   @Override  
					   public void run()  
					   {  
							String uri="/manager/v1/finger/signin";
							ArrayList<NameValuePair> params = new ArrayList<NameValuePair>();
							params.add(new BasicNameValuePair("deviceid","test"));

							//params.add(new BasicNameValuePair("parameter","以Post方式发送请求"));
							String ret = null;// = Network.postdata(uri, params);	
							System.out.println("aa="+ret);
							
					        Message msg = new Message(); 
					        msg.what=2;
					        Bundle data = new Bundle();  
					        data.putString("value", ret);  
					        msg.setData(data);  
							handler.sendMessage(msg);  

					  }  
					}.start(); 
				// Log.d(TAG, "onRecvChar id = " + id + ", size = " +
				// chars.length + ", file = " + new
				// File(getCacheDir().getAbsolutePath(),
				// CHAR_FILE_NAME).getAbsolutePath());
//				mTxtInfo.setText(getString(R.string.string_get_char_success,
//						id, new File(getCacheDir().getAbsolutePath(),
//								CHAR_FILE_NAME).getAbsolutePath()));
//				Utils.getFile(chars, getCacheDir().getAbsolutePath(),
//						CHAR_FILE_NAME);
//				mSpinnerIds.setSelection(id - 1);
				
			
			}

		});
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == REQUEST_CODE) {
			if (resultCode == RESULT_CODE) {
				// String result = data.getStringExtra("second");
				mchildrenid.setText(data.getStringExtra("childreid"));
				mchildrenname.setText(data.getStringExtra("childrenname"));
				mparentname.setText(data.getStringExtra("parentname"));
				mparentphone.setText(data.getStringExtra("parentphone"));
				startenroll();
			}
		}
		super.onActivityResult(requestCode, resultCode, data);
	}

	private String getErrMessage(final int errorCode) {
		String result = "";
		switch (errorCode) {
		case ErrorCode.ERR_FAIL:
			result = getString(R.string.string_err_fail);
			break;
		case ErrorCode.ERR_CONNECTION:
			result = getString(R.string.string_err_connection);
			break;
		case ErrorCode.ERR_VERIFY:
			result = getString(R.string.string_err_verify);
			break;
		case ErrorCode.ERR_IDENTIFY:
			result = getString(R.string.string_err_identify);
			break;
		case ErrorCode.ERR_TMPL_EMPTY:
			result = getString(R.string.string_err_tmpl_empty);
			break;
		case ErrorCode.ERR_TMPL_NOT_EMPTY:
			result = getString(R.string.string_err_tmpl_not_empty);
			break;
		case ErrorCode.ERR_ALL_TMPL_EMPTY:
			result = getString(R.string.string_err_all_tmpl_empty);
			break;
		case ErrorCode.ERR_EMPTY_ID_NOEXIST:
			result = getString(R.string.string_err_tmpl_empty_no_exist);
			break;
		case ErrorCode.ERR_BROKEN_ID_NOEXIST:
			result = getString(R.string.string_err_tmpl_broken_no_exist);
			break;
		case ErrorCode.ERR_INVALID_TMPL_DATA:
			result = getString(R.string.string_err_tmp_invalid);
			break;
		case ErrorCode.ERR_DUPLICATION_ID:
			result = getString(R.string.string_err_tmp_duplication);
			break;
		case ErrorCode.ERR_BAD_QUALITY:
			result = getString(R.string.string_err_bad_qualy);
			break;
		case ErrorCode.ERR_MERGE_FAIL:
			result = getString(R.string.string_err_merge_failed);
			break;
		case ErrorCode.ERR_NOT_AUTHORIZED:
			result = getString(R.string.string_err_auth);
			break;
		case ErrorCode.ERR_MEMORY:
			result = getString(R.string.string_err_memory);
			break;
		case ErrorCode.ERR_INVALID_TMPL_NO:
			result = getString(R.string.string_err_invalid_tmpl_id);
			break;
		case ErrorCode.ERR_INVALID_PARAM:
			result = getString(R.string.string_err_invalid_param);
			break;
		case ErrorCode.ERR_TIME_OUT:
			result = getString(R.string.string_err_time_out);
			break;
		case ErrorCode.ERR_GEN_COUNT:
			result = getString(R.string.string_err_gen_count);
			break;
		case ErrorCode.ERR_INVALID_BUFFER_ID:
			result = getString(R.string.string_err_invalid_buffer_id);
			break;
		case ErrorCode.ERR_INVALID_OPERATION_MODE:
			result = getString(R.string.string_err_invalid_operation_mode);
			break;
		case ErrorCode.ERR_FP_NOT_DETECTED:
			result = getString(R.string.string_err_not_detectd);
			break;
		case ErrorCode.ERR_FP_CANCEL:
			result = getString(R.string.string_err_cancel);
			break;
		default:
			result = getString(R.string.string_err_unknow);
		}
		return result
				+ " "
				+ getString(R.string.string_err_code_format,
						String.format("0x%02x", errorCode));
	}

}
