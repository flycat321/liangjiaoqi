'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, FileSignature, Loader2 } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Contract {
  id: string
  title: string
  status: string
  signed_at: string | null
}

interface Project {
  name: string
  address: string
  area: number | null
  clients: { name: string; phone: string } | null
}

export default function ContractPage() {
  const { id } = useParams()
  const sigRef = useRef<SignatureCanvas>(null)
  const [contract, setContract] = useState<Contract | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSigPad, setShowSigPad] = useState(false)
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ data: proj }, { data: cont }] = await Promise.all([
        supabase.from('projects').select('name, address, area, clients(name, phone)').eq('id', id).single(),
        supabase.from('contracts').select('*').eq('project_id', id).order('created_at', { ascending: false }).limit(1).single(),
      ])
      setProject(proj as unknown as Project)
      setContract(cont)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSign() {
    if (!sigRef.current || sigRef.current.isEmpty()) { toast.error('请先签名'); return }
    if (!contract) return
    setSigning(true)
    const supabase = createClient()
    await supabase.from('contracts').update({
      status: 'signed',
      signed_at: new Date().toISOString(),
    }).eq('id', contract.id)
    setContract(prev => prev ? { ...prev, status: 'signed', signed_at: new Date().toISOString() } : null)
    setShowSigPad(false)
    toast.success('合同已签署')
    setSigning(false)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-accent" /></div>
  }

  const clientName = (project?.clients as { name: string; phone: string } | null)?.name || '___________'
  const isSigned = contract?.status === 'signed'

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-brand-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`} className="p-1 -ml-1 touch-manipulation"><ArrowLeft size={20} /></Link>
          <h1 className="text-sm font-medium">装饰工程合同</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {!contract ? (
          <div className="text-center py-20">
            <FileSignature size={32} className="text-brand-border mx-auto mb-3" />
            <p className="text-brand-text-muted text-sm">合同尚未生成</p>
            <p className="text-brand-text-muted text-xs mt-1">设计师确认方案后将生成合同</p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-brand-border/50 rounded-xl p-5 mb-6">
              <h2 className="text-center font-serif font-bold text-lg mb-1">住宅装饰装修工程施工合同</h2>
              <p className="text-center text-[11px] text-brand-text-muted mb-4">合同编号：LJQ-{new Date().getFullYear()}-001</p>
              <div className="w-8 h-px bg-brand-accent mx-auto mb-6" />

              <div className="space-y-4 text-sm text-brand-text-secondary leading-relaxed">
                <p><strong className="text-brand-text">甲方（委托方）：</strong>{clientName}</p>
                <p><strong className="text-brand-text">乙方（承接方）：</strong>量角器装饰设计工作室</p>
                <p className="text-[11px] text-brand-text-muted">根据《中华人民共和国民法典》及有关法律法规，双方在平等、自愿、协商一致的基础上，就甲方委托乙方进行住宅装饰装修工程事宜，签订本合同。</p>

                <h3 className="text-brand-text font-medium pt-2">第一条　工程概况</h3>
                <p>1.1 工程地址：{project?.address || '___________'}<br/>
                   1.2 建筑面积：{project?.area || '____'}㎡<br/>
                   1.3 工程内容：室内装饰装修工程（含设计、施工管理）<br/>
                   1.4 工程承包方式：包工包辅料，主材甲方自购或委托乙方代购</p>

                <h3 className="text-brand-text font-medium pt-2">第二条　费用构成及标准</h3>
                <p>2.1 <strong>方案设计费</strong>：按建筑面积 ____元/㎡ 计算<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;含：概念方案设计、深化施工图设计、全屋定制拆单图、节点大样图<br/>
                   2.2 <strong>施工费</strong>：按实际工程量据实结算，详见《工程报价单》（附件一）<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;含：水电工程、防水工程、瓦工工程、木工工程、油漆工程及安装工程<br/>
                   2.3 <strong>施工管理费</strong>：按施工费总额的 ___% 计算<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;含：项目经理驻场管理、50+标准工艺节点验收、施工协调及质量管控<br/>
                   2.4 材料代购服务费：如甲方委托乙方代购主材，按材料实际采购价加收 5%-8% 服务费</p>

                <h3 className="text-brand-text font-medium pt-2">第三条　付款方式</h3>
                <p>按以下节点分期支付：<br/>
                   3.1 合同签订时，支付设计费全款及施工费总额的 <strong>30%</strong>；<br/>
                   3.2 水电隐蔽工程验收合格后 3 个工作日内，支付施工费总额的 <strong>30%</strong>；<br/>
                   3.3 瓦工/木工工程验收合格后 3 个工作日内，支付施工费总额的 <strong>30%</strong>；<br/>
                   3.4 竣工验收合格并交付后 7 个工作日内，支付施工费尾款 <strong>10%</strong>。</p>

                <h3 className="text-brand-text font-medium pt-2">第四条　工期约定</h3>
                <p>4.1 计划开工日期：____年____月____日<br/>
                   4.2 计划竣工日期：____年____月____日<br/>
                   4.3 总工期：____ 个日历天<br/>
                   4.4 因甲方原因（方案变更、材料未到场等）导致的延期不计入工期。</p>

                <h3 className="text-brand-text font-medium pt-2">第五条　乙方责任</h3>
                <p>5.1 按照经甲方确认的施工图纸和量角器《标准化工艺体系》进行施工；<br/>
                   5.2 严格执行 50+ 标准工艺节点验收制度，每道工序验收合格后方可进入下一步；<br/>
                   5.3 所有基础辅材（水管、电线、防水涂料、板材等）使用量角器严选供应商品牌，不得擅自替换；<br/>
                   5.4 每个验收节点拍照存档，通过项目管理平台实时向甲方同步进度；<br/>
                   5.5 施工过程中如需设计变更，须填写《设计变更单》经甲方书面确认后方可执行。</p>

                <h3 className="text-brand-text font-medium pt-2">第六条　甲方责任</h3>
                <p>6.1 按本合同约定的时间节点支付款项；<br/>
                   6.2 配合乙方进行各阶段验收确认，收到验收通知后 3 个工作日内完成确认；<br/>
                   6.3 如委托乙方代购主材，须在乙方提交《材料清单》后 5 个工作日内确认；<br/>
                   6.4 施工期间确保施工现场具备施工条件（水、电、场地等）。</p>

                <h3 className="text-brand-text font-medium pt-2">第七条　质量标准与保修</h3>
                <p>7.1 施工质量标准：符合国家《住宅装饰装修工程施工规范》(GB 50327) 及量角器内部质量标准（以较高者为准）；<br/>
                   7.2 <strong>隐蔽工程（水电管路）保修期：5 年</strong>；<br/>
                   7.3 饰面工程保修期：2 年；<br/>
                   7.4 保修期自竣工验收合格之日起计算；<br/>
                   7.5 保修期内因施工质量问题产生的维修费用由乙方承担；<br/>
                   7.6 保修期外，乙方提供终身有偿维护服务。</p>

                <h3 className="text-brand-text font-medium pt-2">第八条　售后服务</h3>
                <p>8.1 竣工交付后 1 个月、3 个月、1 年进行定期回访；<br/>
                   8.2 售后问题 <strong>48 小时内响应</strong>，72 小时内上门处理；<br/>
                   8.3 甲方可通过量角器项目管理平台随时提交售后请求。</p>

                <h3 className="text-brand-text font-medium pt-2">第九条　违约责任</h3>
                <p>9.1 乙方逾期交付：每延迟一日按施工费总额的 0.1% 向甲方支付违约金，累计不超过施工费总额的 5%；<br/>
                   9.2 甲方逾期付款：每延迟一日按应付金额的 0.1% 支付滞纳金；<br/>
                   9.3 因不可抗力导致的延期，双方互不承担违约责任。</p>

                <h3 className="text-brand-text font-medium pt-2">第十条　争议解决</h3>
                <p>本合同在履行中如发生争议，双方应协商解决。协商不成的，提交工程所在地人民法院诉讼解决。</p>

                <h3 className="text-brand-text font-medium pt-2">第十一条　附件</h3>
                <p>以下附件为本合同组成部分，与合同正文具有同等法律效力：<br/>
                   附件一：《工程报价单》<br/>
                   附件二：《材料清单》<br/>
                   附件三：《施工图纸》（电子版）<br/>
                   附件四：《标准化工艺节点清单》</p>

                <div className="border-t border-brand-border/30 pt-4 mt-6">
                  <p className="text-[11px] text-brand-text-muted">
                    本合同一式两份，甲乙双方各持一份，自双方签字（或电子签名）之日起生效。<br/>
                    电子签名与手写签名具有同等法律效力。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-6">
                  <div>
                    <p className="text-xs font-medium mb-6">甲方（签字）：</p>
                    <div className="border-b border-brand-border w-full" />
                    <p className="text-xs text-brand-text-muted mt-2">日期：</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-6">乙方（签字）：</p>
                    <div className="border-b border-brand-border w-full" />
                    <p className="text-xs text-brand-text-muted mt-2">日期：</p>
                  </div>
                </div>
              </div>
            </div>

            {!isSigned ? (
              <>
                {!showSigPad ? (
                  <Button size="lg" className="w-full" onClick={() => setShowSigPad(true)}>
                    <FileSignature size={16} className="mr-2" />阅读完毕，签署合同
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-brand-text-muted text-center">请在下方空白处签名</p>
                    <div className="border-2 border-dashed border-brand-border rounded-xl overflow-hidden bg-white">
                      <SignatureCanvas ref={sigRef} canvasProps={{ className: 'w-full', style: { width: '100%', height: 160 } }} penColor="#1a1a1a" minWidth={1.5} maxWidth={3} />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="md" className="flex-1" onClick={() => sigRef.current?.clear()}>重写</Button>
                      <Button size="md" className="flex-1" loading={signing} onClick={handleSign}>确认签署</Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 bg-green-50 rounded-xl border border-brand-success/20">
                <FileSignature size={28} className="text-brand-success mx-auto mb-2" />
                <p className="text-sm font-medium text-brand-success">合同已签署</p>
                {contract.signed_at && <p className="text-[11px] text-brand-text-muted mt-1">签署时间：{new Date(contract.signed_at).toLocaleString('zh-CN')}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
