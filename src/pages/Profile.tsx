import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { WILAYAS } from '../constants/data';
import { Ad } from '../types';
import { User, Mail, Phone, MapPin, Camera, Loader2, CheckCircle2, LogOut, Shield, Trash2, Edit3, ExternalLink, PlusCircle, Car } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    wilaya: 'الجزائر',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        wilaya: profile.wilaya || 'الجزائر',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'ads'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ad));
      docs.sort((a, b) => {
        const tA = a.createdAt?.seconds || Date.now() / 1000;
        const tB = b.createdAt?.seconds || Date.now() / 1000;
        return tB - tA;
      });
      setUserAds(docs);
      setAdsLoading(false);
    }, (err) => {
      console.error('Error fetching user ads:', err);
      setAdsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDeleteAd = async (adId: string) => {
    if (!window.confirm('هل أنت تأكد من إزالة هذا الإعلان نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'ads', adId));
      toast.success('تم حذف الإعلان بنجاح');
    } catch (error) {
      toast.error('فشل حذف الإعلان');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      toast.error('فشل تسجيل الخروج');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      toast.error('فشل تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white/10 group-hover:border-brand-green transition-all">
            <img src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 p-3 bg-brand-green text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
            <Camera size={20} />
          </button>
        </div>
        <div className="text-center md:text-right space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">{profile?.firstName} {profile?.lastName}</h1>
          <p className="text-white/40">{user.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-2 text-brand-green font-bold text-sm">
            <CheckCircle2 size={16} />
            حساب موثوق
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleUpdate} className="glass-card p-8 space-y-8">
            <h3 className="text-xl font-bold">المعلومات الشخصية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">الاسم</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">اللقب</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">الولاية</label>
                <select
                  value={formData.wilaya}
                  onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                  className="input-field appearance-none"
                >
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <button disabled={loading} type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'حفظ التغييرات'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-bold text-lg border-b border-white/10 pb-3">إحصائيات الحساب</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm text-white/60 font-medium">إعلانات نشطة</span>
                <span className="font-black text-brand-green text-lg">{userAds.filter(a => a.status !== 'sold').length}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm text-white/60 font-medium">إعلانات مباعة</span>
                <span className="font-bold text-white text-lg">{userAds.filter(a => a.status === 'sold').length}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm text-white/60 font-medium">مجموع الإعلانات</span>
                <span className="font-bold text-amber-400 text-lg">{userAds.length}</span>
              </div>
            </div>
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="w-full py-4 bg-brand-green text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-brand-green/20 mb-4"
              >
                <Shield size={22} fill="currentColor" />
                دخول لوحة تحكم المسؤول
              </button>
            )}
            
            {/* Master Admin Status Check */}
            {user?.email?.toLowerCase().trim() === "dalinadjib1990@gmail.com" && (
              <div className="p-4 bg-white/5 rounded-xl border border-brand-green/20 text-[10px] space-y-2 mb-4">
                <div className="flex items-center gap-2 text-brand-green font-black uppercase">
                  <Shield size={12} />
                  <span>بيانات المالك</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-white/60">
                   <p>Email: <span className="text-white font-mono">{user.email}</span></p>
                   <p>Role: <span className="text-white font-mono">{profile?.role || 'null'}</span></p>
                   <p>Calculated isAdmin: <span className={isAdmin ? "text-brand-green" : "text-brand-red"}>{isAdmin ? 'YES' : 'NO'}</span></p>
                </div>
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
            >
              <LogOut size={18} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* User's Published Ads Section */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
              <Car size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black">إعلاناتي المنشورة المحفوظة ({userAds.length})</h2>
              <p className="text-xs text-white/40">تطهر هنا جميع إعلاناتك المحفوظة نهائياً في قاعدة البيانات</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/post')}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-2 shadow-lg"
          >
            <PlusCircle size={16} />
            إضافة إعلان جديد
          </button>
        </div>

        {adsLoading ? (
          <div className="py-12 flex justify-center items-center gap-3 text-white/60">
            <Loader2 className="animate-spin text-brand-green" size={24} />
            <span className="font-bold">جاري تحميل إعلاناتك...</span>
          </div>
        ) : userAds.length === 0 ? (
          <div className="py-12 text-center space-y-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Car size={40} className="mx-auto text-white/20" />
            <p className="text-white/60 font-bold">لم تقم بنشر أي إعلان بعد</p>
            <button 
              onClick={() => navigate('/post')}
              className="btn-primary text-sm py-2 px-6 inline-flex items-center gap-2"
            >
              <PlusCircle size={18} />
              انشر أول إعلان لك الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAds.map(ad => (
              <div key={ad.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center hover:border-brand-green/30 transition-all">
                <img 
                  src={ad.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80'} 
                  alt={ad.title} 
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green font-bold border border-brand-green/20">
                      {ad.brand} {ad.model}
                    </span>
                    {ad.status === 'sold' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-red/20 text-brand-red font-bold">
                        تم البيع
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base truncate text-white">{ad.title}</h3>
                  <p className="text-brand-green font-black text-sm">
                    {ad.price?.toLocaleString()} د.ج
                  </p>
                  <p className="text-[10px] text-white/40">
                    الولاية: {ad.wilaya} • السنة: {ad.year}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => navigate(`/ad/${ad.id}`)}
                    title="عرض الإعلان"
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/post?edit=${ad.id}`)}
                    title="تعديل الإعلان"
                    className="p-2 bg-brand-green/20 hover:bg-brand-green/30 text-brand-green rounded-xl transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAd(ad.id)}
                    title="حذف الإعلان"
                    className="p-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
