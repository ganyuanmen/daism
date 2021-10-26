package com.example.newdaism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.newdaism.entity.*;
import com.example.newdaism.mapper.*;
import com.example.newdaism.service.IDataservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
public class DataController {
    private  static String[] ArList=new String[]{
            "t_dao","t_setlogo","t_changelogo","t_os","t_token"
    };

    private  static ExecutorService exec = Executors.newFixedThreadPool(1);
    @Autowired
    private IDataservice iDataservice;

    @Autowired
    private ADaoMapper aDaoMapper;

    @Autowired
    TDaoMapper tDaoMapper;

    @Autowired
    TChangelogoMapper tChangelogoMapper;

    @Autowired
    TSetlogoMapper tSetlogoMapper;

    @Autowired
    TOsMapper tOsMapper;

    @Autowired
    TTokenMapper tTokenMapper;

    @Autowired
    private VDaoMapper vDaoMapper;


    @RequestMapping("/getData")
    public IPage<VDao> getData(@RequestBody RequetDao requetDao)
    {
        return  vDaoMapper.selectPage (gene_page(requetDao) , gene_condition(requetDao));
    }

    @RequestMapping("/getDaoList")
    public List<VDao> getDaoList(@RequestBody RequestDaoList requestDaoList)
    {

            QueryWrapper<VDao> wrapper=new QueryWrapper<>();
            if(requestDaoList.getTokenId()>0) {
                if(requestDaoList.getSeacherText().startsWith("0x"))
                {
                    wrapper.eq("dao_manager",requestDaoList.getSeacherText());
                    wrapper.or();
                    wrapper.eq("os_address",requestDaoList.getSeacherText());
                }
                else {
                    wrapper.like("dao_name", requestDaoList.getSeacherText());
                    wrapper.or();
                    wrapper.like("dao_symbol", requestDaoList.getSeacherText());
                };
                wrapper.last(" and token_id>0");

             //   wrapper.ge("token_id",0);


            }
            else {
                wrapper.eq("dao_manager", requestDaoList.getManagerAddress());

            }

            List<VDao> obj=vDaoMapper.selectList(wrapper);
            return  obj;

    }

    @RequestMapping("/getAllDaoList")
    public List<SimpleDao> getAllDaoList()
    {

       List<SimpleDao> list=tDaoMapper.getDaoList("select dao_id,dao_name,dao_symbol from v_dao");

       return  list;
    }
    @RequestMapping("/getTokenDaoList")
    public List getTokenDaoList()
    {
        QueryWrapper<VDao> wrapper=new QueryWrapper<>();
        wrapper.ge("token_id",0);
        List<VDao> obj=vDaoMapper.selectList(wrapper);
        return  obj;
    }


    @RequestMapping(value = "/updateDao", method = RequestMethod.POST)
    public void updateRoom(@RequestBody TDao obj)
    {
       tDaoMapper.insert(obj);
    }


    @RequestMapping(value = "/getDao", method = RequestMethod.POST)
    public TDao getDao(@RequestBody TDao obj)
    {
        QueryWrapper<TDao> wrapper=new QueryWrapper<>();
        wrapper.eq("dao_name",obj.getDaoName());
        wrapper.or();
        wrapper.eq("dao_symbol",obj.getDaoSymbol());
        TDao curDao=  tDaoMapper.selectOne(wrapper);
       if(curDao==null) return  new TDao();
       else  return  curDao;
    }

    @RequestMapping(value = "/updateSetLogo", method = RequestMethod.POST)
    public void updateSetLogo(@RequestBody TSetlogo obj) {
        exec.submit(() -> {
            TSetlogo obj1 = tSetlogoMapper.selectById(obj.getDaoId());
            if (obj1 == null) {
                Object k = tSetlogoMapper.insert(obj);
                System.out.println(obj.getDaoId() + "  insert ---->" + k.toString() + "__block" + obj.getBlockNum());
            } else {
                if (obj.getBlockNum() > obj1.getBlockNum()) {
                    Object o = tSetlogoMapper.updateById(obj);
                    System.out.println(obj.getDaoId() + "  update ==================>" + o.toString() + "__block" + obj.getBlockNum());
                }
            }
        });
    }

    @RequestMapping(value = "/updateChangeLogo", method = RequestMethod.POST)
    public void updateChangeLogo(@RequestBody TChangelogo obj) {
        exec.submit(() -> {
            TChangelogo obj1 = tChangelogoMapper.selectById(obj.getDaoId());
            if (obj1 == null) {
                Object k = tChangelogoMapper.insert(obj);
                System.out.println(obj.getDaoId() + "  insert ---->" + k.toString() + "__block" + obj.getBlockNum());
            } else {
                if (obj.getBlockNum() > obj1.getBlockNum()) {
                    Object o = tChangelogoMapper.updateById(obj);
                    System.out.println(obj.getDaoId() + "  update ==================>" + o.toString() + "__block" + obj.getBlockNum());
                }
            }
        });
    }

    @RequestMapping(value = "/updateOs", method = RequestMethod.POST)
    public void updateOs(@RequestBody TOs obj) {
        exec.submit(() -> {
            TOs obj1 = tOsMapper.selectById(obj.getDaoId());
            if (obj1 == null) {
                Object k = tOsMapper.insert(obj);
                System.out.println(obj.getDaoId() + "  insert ---->" + k.toString() + "__block" + obj.getBlockNum());
            } else {
                if (obj.getBlockNum() > obj1.getBlockNum()) {
                    Object o = tOsMapper.updateById(obj);
                    System.out.println(obj.getDaoId() + "  update ==================>" + o.toString() + "__block" + obj.getBlockNum());
                }
            }
        });
    }

    @RequestMapping(value = "/updateToken", method = RequestMethod.POST)
    public void updateToken(@RequestBody TToken obj)
    {
        exec.submit(() -> {
            TToken obj1 = tTokenMapper.selectById(obj.getDaoId());
            if (obj1 == null) {
                Object k=   tTokenMapper.insert(obj);
                System.out.println(obj.getDaoId() + "  insert ---->"+k.toString()+"__block"+ obj.getBlockNum());
            } else {
                if(obj.getBlockNum()>obj1.getBlockNum()) {
                    Object o = tTokenMapper.updateById(obj);
                    System.out.println(obj.getDaoId() + "  update ==================>" + o.toString() + "__block" + obj.getBlockNum());
                }
            }
        });

    }


    @RequestMapping("/getMaxBlock/{id}")
    public long getMaxBlock(@PathVariable("id") int id)
    {
       return tDaoMapper.getMaxBlock("select ifnull(max(block_num),0) from "+ArList[id]);

    }

    @RequestMapping(value = "/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
        File dest = multipartFileToFile(file);
        file.transferTo(dest);// 文件写入
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(dest);
        String xpathExpression = "//path/@d";
        XPathFactory xpf = XPathFactory.newInstance();
        XPath xpath = xpf.newXPath();
        XPathExpression expression = xpath.compile(xpathExpression);
        NodeList svgPaths = (NodeList)expression.evaluate(document, XPathConstants.NODESET);
        String reStr= svgPaths.item(0).getNodeValue();
        dest.delete();
        return reStr;
    }
    /**
     * MultipartFile 转 File
     *
     * @param file
     * @throws Exception
     */
    public static File multipartFileToFile(MultipartFile file) {

        File toFile = null;
        try {
            if (file.equals("") || file.getSize() <= 0) {
                file = null;
            } else {
                InputStream ins = null;
                ins = file.getInputStream();
                toFile = new File(file.getOriginalFilename());
                inputStreamToFile(ins, toFile);
                ins.close();
            }
        }catch (Exception e)
        {
            e.printStackTrace();
        }
        return toFile;
    }


    //获取流文件
    private static void inputStreamToFile(InputStream ins, File file) {
        try {
            OutputStream os = new FileOutputStream(file);
            int bytesRead = 0;
            byte[] buffer = new byte[8192];
            while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.close();
            ins.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private Page<VDao> gene_page(RequetDao condition)
    {
        Page<VDao> atodoPage = new Page<>(condition.getPageNum() , condition.getPageSize());
        List<OrderItem> olist=new ArrayList<>();
        if(condition.getOrder()!=null)
        {
            if(condition.getOrderType()==null) olist.add(OrderItem.asc(condition.getOrder()));
            else if(condition.getOrderType().equals("asc"))   olist.add(OrderItem.asc(condition.getOrder()));
            else  olist.add(OrderItem.desc(condition.getOrder()));
        } else
        {
            olist.add(OrderItem.asc("dao_id"));
        }
        atodoPage.setOrders(olist);
        return atodoPage;
    }
    private  LambdaQueryWrapper<VDao> gene_condition(RequetDao condition)
    {
        LambdaQueryWrapper<VDao> atodoLambdaQueryWrapper = Wrappers.lambdaQuery();
        if(condition.getTitle()!=null) {
            atodoLambdaQueryWrapper.like(VDao::getDaoName, condition.getTitle()).or().like(VDao::getDaoSymbol,condition.getTitle());
        }
        return  atodoLambdaQueryWrapper;

    }
}
