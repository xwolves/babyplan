import sys
import redis
import MySQLdb

def delEshopUser(username):
    try:
        conn = MySQLdb.connect(host='localhost',user='deposit',passwd='Deposit@00',db='db_eshop',port=3306)
        cur=conn.cursor()
        cur.execute('SET NAMES UTF8')
        cur.execute("select user_name,user_id,email from ecs_users where user_name = '%d'" % username)
        res = cur.fetchall()
        for row in res:
            print "    delete eshop user: %s -> %d, %s" %(row[0],row[1],row[2])
            uid = row[1]
            cur.execute("delete from ecs_booking_goods where user_id = %d" %uid)
            cur.execute("delete from ecs_collect_goods where user_id = %d" %uid)
            cur.execute("delete from ecs_feedback where user_id = %d" %uid)
            cur.execute("delete from ecs_user_address where user_id = %d" %uid)
            cur.execute("delete from ecs_user_bonus where user_id = %d" %uid)
            cur.execute("delete from ecs_user_account where user_id = %d" %uid)
            cur.execute("delete from ecs_tag where user_id = %d" %uid)
            cur.execute("delete from ecs_account_log where user_id = %d" %uid)
            cur.execute("delete from ecs_sns where user_id = %d" %uid)
            cur.execute("delete from ecs_users where user_id = %d" %uid)

        cur.close()
        conn.close()
    except MySQLdb.Error,e:
        print "Mysql Error %d: %s\n" %(e.args[0],e.args[1])

def delParent(uid):
    try:
        conn = MySQLdb.connect(host='localhost',user='deposit',passwd='Deposit@00',db='db_deposit',port=3306)
        cur=conn.cursor()
        cur.execute('SET NAMES UTF8')

        # delete eshop information
        delEshopUser(uid)
        print "uid = %d: delete parent eshop information" %uid

        # delete children signin information
        n=cur.execute("delete from tb_children_signin where ChildID in (select ChildrenID from tb_parent_children where ParentID = %d)" % uid)
        print "uid = %d: delete children signin information count = %d" %(uid,n)

        # delete children information
        n=cur.execute("delete from tb_accnt_children where AccountID in (select ChildrenID from tb_parent_children where ParentID = %d)" % uid)
        print "uid = %d: delete children information count = %d" %(uid,n)

        # delete deposit children information
        n=cur.execute("delete from tb_deposit_children where ChildrenID in (select ChildrenID from tb_parent_children where ParentID = %d)" % uid)
        print "uid = %d: delete deposit children information count = %d" %(uid,n)

        # delete parent children information
        n=cur.execute("delete from tb_parent_children where ParentID = %d" % uid)
        print "uid = %d: delete parent children information count = %d" %(uid,n)

        # delete deposit parent comments
        n=cur.execute("delete from tb_deposit_parent_comments where ParentID = %d" % uid)
        print "uid = %d: delete deposit parent comments count = %d" %(uid,n)

        # delete deposit daily comments
        n=cur.execute("delete from tb_deposit_daily_comments where CommentBy = %d" % uid)
        print "uid = %d: delete deposit daily comments count = %d" %(uid,n)

        # delete parent orders
        n=cur.execute("delete from tb_parent_order where ParentID = %d" % uid)
        print "uid = %d: delete parent orders count = %d" %(uid,n)

        # last, delete parent info
        n=cur.execute("delete from tb_accnt_parent where AccountID = %d" % uid)
        print "uid = %d: delete parent account count = %d" %(uid,n)

        # delete redis login token information
        r = redis.StrictRedis(host='localhost',port=6379)
        keys = r.keys("%d:*" %uid)
        if len(keys) > 0 :
            n=r.delete(*keys)
            print "uid = %d: delete parent redis login tokens, count = %d" %(uid,n)

        cur.close()
        conn.close()
    except MySQLdb.Error,e:
        print "Mysql Error %d: %s\n" %(e.args[0],e.args[1])

def getAllParent():
    try:
        parents = {}
        conn = MySQLdb.connect(host='localhost',user='deposit',passwd='Deposit@00',db='db_deposit',port=3306)
        cur=conn.cursor()
        cur.execute('SET NAMES UTF8')
        cur.execute('select AccountID,Mobile,Name,Email from tb_accnt_parent order by AccountID')
        res = cur.fetchall()
        for row in res:
            print "deposit user: %d -> %s, %s, %s" %(row[0],row[1],row[2],row[3])
            parents[row[1]] = row[0]

        cur.close()
        conn.close()
        return parents
    except MySQLdb.Error,e:
        print "Mysql Error %d: %s\n" %(e.args[0],e.args[1])


if __name__ == "__main__":
    print "delete parent user by mobile"
    print "usage\t<mobile1> <mobile2> ..."
    parents = getAllParent()
    if len(sys.argv) < 2:
        sys.exit(0)
    for i in range(1, len(sys.argv)):
        if parents.has_key(sys.argv[i]) :
            delParent(parents[sys.argv[i]])
    print "done"
