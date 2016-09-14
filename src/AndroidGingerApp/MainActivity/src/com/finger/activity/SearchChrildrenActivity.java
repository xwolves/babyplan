package com.finger.activity;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.json.JSONObject;

import com.finger.utils.Network;


import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.Menu;
import android.view.View;

import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;

import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

public class SearchChrildrenActivity extends Activity implements
		SearchView.OnQueryTextListener, OnItemClickListener {

	MsgHandler handler = new MsgHandler(this);
	private SearchView searchview;
	private ListView listview;
	List<Map<String, Object>> listdata;
	SimpleAdapter adapter;
//	private ArrayAdapter<String> adapter;

	// 自动完成的列表

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_searchchrid_acivity);

		searchview = (SearchView) findViewById(R.id.search);
		listview = (ListView) findViewById(R.id.list);
		
		
		new Thread() {
			@Override
			public void run() {
				String uri = "device/setting/get";
				JSONObject  obj = Network.getDate(uri);
				// System.out.println("aa="+ret.toString());

				Message msg = new Message();
				listdata=getData();
				
				handler.sendMessage(msg);

			}
		}.start();
		
		
		
		
//		names = new String[] { "ad", "dffa", "uyiu", "rqer", "qwgt", "afrgb",
//				"rtyr" };
//		
//		adapter = new ArrayAdapter<String>(getApplicationContext(),
//				android.R.layout.simple_expandable_list_item_1, names);
//
//		listview.setAdapter(adapter);
		
		listdata = getData();
		
	    adapter = new SimpleAdapter(this,listdata,R.layout.listitem,
	                new String[]{"childrenname","parentname"},
	                new int[]{R.id.title,R.id.info});
	     listview.setAdapter(adapter);
		
		
		listview.setTextFilterEnabled(true);
		listview.setOnItemClickListener(this);

		searchview.setOnQueryTextListener(this);
		// SearchView去掉（修改）搜索框的背景 修改光标
		// setSearchViewBackground(searchView);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.search_chrildren, menu);
		return true;
	}

	@Override
	public boolean onQueryTextChange(String newText) {
		// if (newText.length() != 0) {
		// listview.setFilterText(newText);
		// } else {
		// listview.clearTextFilter();
		// }
		// return false;
		ListAdapter adapter = listview.getAdapter();
		if (adapter instanceof Filterable) {
			Filter filter = ((Filterable) adapter).getFilter();
			if (newText == null || newText.length() == 0) {
				filter.filter(null);
			} else {
				filter.filter(newText);
			}
		}
		return true;
	}

	@Override
	public boolean onQueryTextSubmit(String arg0) {
		// TODO Auto-generated method stub
		return false;
	}

	private List<Map<String, Object>> getData() {			
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("childrenname", "childrenname1");
		map.put("parentname", "parentname 1");
		map.put("childreid", "childreid 1");
		map.put("parentphone", "parentphone 1");
		list.add(map);

		map = new HashMap<String, Object>();
		map.put("childrenname", "childrenname2");
		map.put("parentname", "parentname 2");
		map.put("childreid", "childreid 2");
		map.put("parentphone", "parentphone 2");
		list.add(map);

		map = new HashMap<String, Object>();
		map.put("childrenname", "childrenname2");
		map.put("parentname", "parentname 3");
		map.put("childreid", "childreid 3");
		map.put("parentphone", "parentphone 3");
		list.add(map);

		return list;
	}

	@Override
	public void onItemClick(AdapterView<?> parent, View view, int position,
			long id) {
		Map<String, Object> mapvalue = listdata.get(position);
		
        Intent intent=new Intent();
        intent.putExtra("childreid", (String)mapvalue.get("childreid"));
        intent.putExtra("childrenname",  (String)mapvalue.get("childrenname"));
        intent.putExtra("parentname", (String)mapvalue.get("parentname"));
        intent.putExtra("parentphone", (String)mapvalue.get("parentphone"));
        
        setResult(101, intent);
        finish();
		// TODO Auto-generated method stub
//		Toast.makeText(SearchChrildrenActivity.this,  (String)test.get("childrenname")+ (String)test.get("parentphone"),
//				Toast.LENGTH_SHORT).show();

	}
	
	
	static class MsgHandler extends Handler {
		private WeakReference<Activity> mActivity;

		MsgHandler(Activity activity) {
			mActivity = new WeakReference<Activity>(activity);
		}

		@Override
		public void handleMessage(Message msg) {
			SearchChrildrenActivity activity = (SearchChrildrenActivity) mActivity.get();

			activity.adapter.notifyDataSetChanged();
			//Bundle data = msg.getData();


		}
	}

}
