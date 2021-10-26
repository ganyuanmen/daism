package com.example.newdaism;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.admin.methods.response.PersonalListAccounts;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.http.HttpService;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import java.math.BigInteger;
import java.util.List;

@MapperScan("com.example.newdaism.mapper")
@SpringBootApplication
public class NewDaismApplication implements ApplicationRunner {

    public static void main(String[] args) {
        SpringApplication.run(NewDaismApplication.class, args);
     //   String  _a='';
        
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {


   //     Web3j web3j= Web3j.build(new HttpService("https://ropsten.infura.io/v3/9676a35d629d488fb90d7eac1348c838"));
//
//        String address = "0x3f0c7e9ef3c7b17c36fa4dcc85e06b737147428d";
//        EthGetBalance ethGetBalance = web3j.ethGetBalance(address, DefaultBlockParameterName.LATEST).send();
//        BigInteger balance = ethGetBalance.getBalance();
//
//        System.out.println("address " + address + " balance " + balance + "wei");

//       // Subscription subscription = (Subscription)
//                web3j.blockFlowable(true).subscribe(block -> {
//            System.out.println(block);
//        });
//
//        web3j.transactionFlowable().subscribe(tx -> {
//
//            System.out.println(tx);
//        });
//
//        EthFilter filter = new EthFilter(
//                DefaultBlockParameterName.EARLIEST,
//                DefaultBlockParameterName.LATEST,
//                "0x84bB9f75af35e310C6F606e9a5e83f5fa4cc514D"
//        ).addSingleTopic("rr");
//
//        web3j.ethLogFlowable(filter).subscribe(log -> {
//
//            System.out.println(log);
//        });

        System.out.println("service is ok!");
    }
}
