import java.util.*;
import java.util.stream.Collectors;

/**
 * 修复工具类
 */
public class FixUtil {
    
    private static final String PREFIX = "FIX_";
    private static final int MAX_SIZE = 100;
    
    /**
     * 处理数据列表
     */
    public List<String> processData(List<String> dataList) {
        if (dataList == null || dataList.isEmpty()) {
            return new ArrayList<>();
        }
        
        return dataList.stream()
                .filter(item -> item != null && !item.trim().isEmpty())
                .map(item -> PREFIX + item.toUpperCase())
                .limit(MAX_SIZE)
                .collect(Collectors.toList());
    }
    
    /**
     * 验证输入参数
     */
    public boolean validateInput(String input) {
        return input != null && input.length() > 0 && input.length() < 256;
    }
}
