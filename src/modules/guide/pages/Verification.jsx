import { useState } from "react";
import { ShieldCheck, CheckCircle2, Clock, Upload, AlertCircle, FileText, Award, Building, UserCheck } from "lucide-react";
import Card from "../ui/card";
import Button from "../ui/button";

export default function Verification() {
  const [govIdUploaded, setGovIdUploaded] = useState(true);
  const [guideLicenseUploaded, setGuideLicenseUploaded] = useState(true);
  const [addressUploaded, setAddressUploaded] = useState(false);

  return (
    <div className="verification-page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Guide Verification & Credentials</h1>
          <p className="page-sub">Verified guides receive the Abeon Pro Gold Badge and 3x more bookings.</p>
        </div>
        <div className="verification-badge-pill">
          <ShieldCheck size={18} />
          <span>Profile 85% Verified</span>
        </div>
      </div>

      <div className="grid grid-main mt">
        <div className="verification-steps-list">
          {/* Item 1 */}
          <Card className="verif-card completed">
            <div className="verif-header">
              <div className="verif-icon-wrap done">
                <CheckCircle2 size={24} />
              </div>
              <div className="verif-info">
                <div className="verif-title-row">
                  <h4>Government ID Verification</h4>
                  <span className="badge badge-confirmed">Verified</span>
                </div>
                <p className="verif-desc">Aadhaar Card / Passport verified with national registry database.</p>
                <div className="verif-meta">
                  <FileText size={14} />
                  <span>Aadhaar_Agam_XXXXX.pdf · Verified on 14 Aug 2026</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Item 2 */}
          <Card className="verif-card completed">
            <div className="verif-header">
              <div className="verif-icon-wrap done">
                <CheckCircle2 size={24} />
              </div>
              <div className="verif-info">
                <div className="verif-title-row">
                  <h4>Himachal Pradesh Tourism Guide License</h4>
                  <span className="badge badge-confirmed">Verified</span>
                </div>
                <p className="verif-desc">Official state certified tourist guide license (License ID: HP-MKT-88412).</p>
                <div className="verif-meta">
                  <Award size={14} />
                  <span>License_HP_Tourism.pdf · Valid until Dec 2028</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Item 3 */}
          <Card className="verif-card pending">
            <div className="verif-header">
              <div className="verif-icon-wrap pending">
                <Clock size={24} />
              </div>
              <div className="verif-info">
                <div className="verif-title-row">
                  <h4>Proof of Local Residence / Business Address</h4>
                  <span className="badge badge-pending">Action Required</span>
                </div>
                <p className="verif-desc">Upload a recent utility bill or rental agreement within Manali/Himachal region.</p>
                
                <div className="upload-box-mini">
                  <Upload size={20} />
                  <span>Drop your utility bill or lease agreement here, or <strong>browse files</strong></span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setAddressUploaded(true);
                      alert("Address verification document submitted successfully! Review completed within 24 hours.");
                    }}
                  >
                    {addressUploaded ? "Resubmit Document" : "Submit For Verification"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Item 4 */}
          <Card className="verif-card completed">
            <div className="verif-header">
              <div className="verif-icon-wrap done">
                <CheckCircle2 size={24} />
              </div>
              <div className="verif-info">
                <div className="verif-title-row">
                  <h4>Mountain First Aid & Wilderness Safety Certification</h4>
                  <span className="badge badge-confirmed">Verified</span>
                </div>
                <p className="verif-desc">Certified by Atal Bihari Vajpayee Institute of Mountaineering and Allied Sports (ABVIMAS).</p>
                <div className="verif-meta">
                  <Award size={14} />
                  <span>ABVIMAS_Rescue_Cert_2025.pdf · Level 3 Advanced</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="verif-sidebar-col">
          <Card className="verif-summary-card">
            <div className="verif-avatar-block">
              <img src="/agam-profile.jpg" alt="Agam" className="verif-avatar-img" />
              <div className="badge-pro-stamp">
                <ShieldCheck size={16} /> Pro Guide
              </div>
              <h3>Agam</h3>
              <p className="verif-role-tag">Certified Adventure & Cultural Host</p>
            </div>

            <div className="verif-perks-list">
              <div className="perk-item">
                <CheckCircle2 size={16} color="#0284c7" />
                <span>Verified badge on listings</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} color="#0284c7" />
                <span>Priority placement in traveler searches</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} color="#0284c7" />
                <span>Instant payout enablement</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} color="#0284c7" />
                <span>Dedicated Abeon Partner Support</span>
              </div>
            </div>
          </Card>

          <Card className="trust-help-card mt">
            <div className="flex items-center gap-2" style={{ color: "var(--brand)", fontWeight: 600, marginBottom: 8 }}>
              <AlertCircle size={18} />
              <span>Need Verification Help?</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              Our host onboarding specialist is available on WhatsApp or phone to review your physical permits.
            </p>
            <button className="btn btn-outline btn-block" style={{ marginTop: 14 }} onClick={() => alert("Connecting to partner specialist...")}>
              Contact Partner Support
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
